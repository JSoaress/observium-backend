import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { Log } from "@/app/logs/domain/models/log";

import { IProjectRepository, ILogRepository } from "../../../repos";
import { GetLogByIdUseCaseGateway, GetLogByIdUseCaseInput, GetLogByIdUseCaseOutput } from "./types";

export class GetLogByIdUseCase extends UseCase<GetLogByIdUseCaseInput, GetLogByIdUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private logRepository: ILogRepository;

    constructor({ repositoryFactory }: GetLogByIdUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository);
    }

    protected async impl({ id, requestUser }: GetLogByIdUseCaseInput): Promise<GetLogByIdUseCaseOutput> {
        if (!id) return left(new MissingParamError("id"));
        return this.unitOfWork.execute<GetLogByIdUseCaseOutput>(async () => {
            const log = await this.logRepository.findById(id);
            if (!log) return left(new NotFoundModelError(Log.name, id));
            const logBelongToUser = await this.projectRepository.exists({ id: log.projectId, userId: requestUser.getId() });
            if (!logBelongToUser) return left(new NotFoundModelError(Log.name, id));
            return right(log);
        });
    }
}
