import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { Project } from "@/app/logs/domain/models/project";

import { ILogRepository, IProjectRepository } from "../../../repos";
import { GetDailyLogsUseCaseGateway, GetDailyLogsUseCaseInput, GetDailyLogsUseCaseOutput } from "./types";

export class GetDailyLogsUseCase extends UseCase<GetDailyLogsUseCaseInput, GetDailyLogsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private logRepository: ILogRepository;

    constructor({ repositoryFactory }: GetDailyLogsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository);
    }

    protected async impl({ projectIdOrSlug, requestUser }: GetDailyLogsUseCaseInput): Promise<GetDailyLogsUseCaseOutput> {
        if (!projectIdOrSlug) return left(new MissingParamError("projectIdOrSlug"));
        return this.unitOfWork.execute<GetDailyLogsUseCaseOutput>(async () => {
            // TODO: construir um metodo unico para buscar projeto por ID ou slug
            const filter = { slug: projectIdOrSlug, userId: requestUser.getId() };
            let project = await this.projectRepository.findOne({ filter });
            if (!project) project = await this.projectRepository.findById(projectIdOrSlug);
            if (!project || project.userId !== requestUser.getId())
                return left(new NotFoundModelError(Project.name, projectIdOrSlug));
            const dailyLogs = await this.logRepository.getDailyLogsByProject(project.getId());
            return right(dailyLogs);
        });
    }
}
