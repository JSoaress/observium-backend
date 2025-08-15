import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { ForbiddenError, MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { IProjectRepository } from "@/app/projects/application/repos";
import { Project } from "@/app/projects/domain/models/project";

import { ILogRepository } from "../../../repos";
import { GetHourlyLogsUseCaseGateway, GetHourlyLogsUseCaseInput, GetHourlyLogsUseCaseOutput } from "./types";

export class GetHourlyLogsUseCase extends UseCase<GetHourlyLogsUseCaseInput, GetHourlyLogsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private workspaceRepository: IWorkspaceRepository;
    private logRepository: ILogRepository;

    constructor({ repositoryFactory }: GetHourlyLogsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository, this.workspaceRepository);
    }

    protected async impl({ projectIdOrSlug, requestUser }: GetHourlyLogsUseCaseInput): Promise<GetHourlyLogsUseCaseOutput> {
        if (!projectIdOrSlug) return left(new MissingParamError("projectIdOrSlug"));
        return this.unitOfWork.execute<GetHourlyLogsUseCaseOutput>(async () => {
            // TODO: construir um metodo unico para buscar projeto por ID ou slug
            const filter = { slug: projectIdOrSlug };
            let project = await this.projectRepository.findOne({ filter });
            if (!project) project = await this.projectRepository.findById(projectIdOrSlug);
            if (!project) return left(new NotFoundModelError(Project.name, projectIdOrSlug));
            const workspace = (await this.workspaceRepository.findById(project.get("workspaceId"))) as Workspace;
            if (!workspace.userBelongsToWorkspace(requestUser))
                return left(new ForbiddenError(`Você não pode acessar projetos da workspace ${workspace.get("name")}`));
            const hourlyLogs = await this.logRepository.getHourlyLogsByProject(project.getId());
            return right(hourlyLogs);
        });
    }
}
