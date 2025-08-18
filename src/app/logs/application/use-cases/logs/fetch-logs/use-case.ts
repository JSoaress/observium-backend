import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { IProjectRepository } from "@/app/projects/application/repos";
import { Project } from "@/app/projects/domain/models/project";

import { ILogRepository } from "../../../repos";
import { FetchLogsUseCaseGateway, FetchLogsUseCaseInput, FetchLogsUseCaseOutput } from "./types";

export class FetchLogsUseCase extends UseCase<FetchLogsUseCaseInput, FetchLogsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private workspaceRepository: IWorkspaceRepository;
    private logRepository: ILogRepository;

    constructor({ repositoryFactory }: FetchLogsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.workspaceRepository, this.logRepository);
    }

    protected async impl({ projectId, requestUser, queryOptions }: FetchLogsUseCaseInput): Promise<FetchLogsUseCaseOutput> {
        return this.unitOfWork.execute<FetchLogsUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { id: projectId } });
            if (!project) return left(new NotFoundModelError(Project.name, projectId));
            const workspace = (await this.workspaceRepository.findById(project.get("workspaceId"))) as Workspace;
            if (!workspace.userBelongsToWorkspace(requestUser)) return left(new NotFoundModelError(Project.name, projectId));
            const filter = { ...queryOptions?.filter, projectId };
            const count = await this.logRepository.count(filter);
            const logs = await this.logRepository.findSimplified({ ...queryOptions, filter });
            return right({ count, results: logs });
        });
    }
}
