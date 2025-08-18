import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { Log } from "@/app/logs/domain/models/log";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { IProjectRepository } from "@/app/projects/application/repos";
import { Project } from "@/app/projects/domain/models/project";

import { ILogRepository } from "../../../repos";
import { GetLogByIdUseCaseGateway, GetLogByIdUseCaseInput, GetLogByIdUseCaseOutput } from "./types";

export class GetLogByIdUseCase extends UseCase<GetLogByIdUseCaseInput, GetLogByIdUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private workspaceRepository: IWorkspaceRepository;
    private logRepository: ILogRepository;

    constructor({ repositoryFactory }: GetLogByIdUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository, this.workspaceRepository);
    }

    protected async impl({ id, requestUser }: GetLogByIdUseCaseInput): Promise<GetLogByIdUseCaseOutput> {
        if (!id) return left(new MissingParamError("id"));
        return this.unitOfWork.execute<GetLogByIdUseCaseOutput>(async () => {
            const log = await this.logRepository.findById(id);
            if (!log) return left(new NotFoundModelError(Log.name, id));
            const project = (await this.projectRepository.findOne({ filter: { id: log.get("projectId") } })) as Project;
            const workspace = (await this.workspaceRepository.findById(project.get("workspaceId"))) as Workspace;
            if (!workspace.userBelongsToWorkspace(requestUser)) return left(new NotFoundModelError(Log.name, id));
            return right(log);
        });
    }
}
