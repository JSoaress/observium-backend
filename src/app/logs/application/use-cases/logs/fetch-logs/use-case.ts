import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { NotFoundModelError } from "@/app/_common/errors";
import { Project } from "@/app/logs/domain/models/project";

import { IProjectRepository, ILogRepository } from "../../../repos";
import { FetchLogsUseCaseGateway, FetchLogsUseCaseInput, FetchLogsUseCaseOutput } from "./types";

export class FetchLogsUseCase extends UseCase<FetchLogsUseCaseInput, FetchLogsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private logRepository: ILogRepository;

    constructor({ repositoryFactory }: FetchLogsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository);
    }

    protected async impl({ projectId, requestUser, queryOptions }: FetchLogsUseCaseInput): Promise<FetchLogsUseCaseOutput> {
        return this.unitOfWork.execute<FetchLogsUseCaseOutput>(async () => {
            const projectExists = await this.projectRepository.exists({ id: projectId, userId: requestUser.getId() });
            if (!projectExists) return left(new NotFoundModelError(Project.name, projectId));
            const filter = { ...queryOptions?.filter, projectId };
            const count = await this.logRepository.count(filter);
            const logs = await this.logRepository.findSimplified({ ...queryOptions, filter });
            return right({ count, results: logs });
        });
    }
}
