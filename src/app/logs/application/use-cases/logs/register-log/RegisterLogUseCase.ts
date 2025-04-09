import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { NotFoundModelError } from "@/app/_common/errors";
import { Log } from "@/app/logs/domain/models/log";
import { Project } from "@/app/logs/domain/models/project";
import { IWebSocket } from "@/infra/socket";

import { ILogRepository, IProjectRepository } from "../../../repos";
import { RegisterLogUseCaseGateway, RegisterLogUseCaseInput, RegisterLogUseCaseOutput } from "./types";

export class RegisterLogUseCase extends UseCase<RegisterLogUseCaseInput, RegisterLogUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private logRepository: ILogRepository;
    private webSocket: IWebSocket;

    constructor({ repositoryFactory, webSocket }: RegisterLogUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository);
        this.webSocket = webSocket;
    }

    protected impl({ requestUser, projectSlug, ...input }: RegisterLogUseCaseInput): Promise<RegisterLogUseCaseOutput> {
        return this.unitOfWork.execute<RegisterLogUseCaseOutput>(async () => {
            const filter = { slug: projectSlug, userId: requestUser.getId() };
            const project = await this.projectRepository.findOne({ filter });
            if (!project) return left(new NotFoundModelError(Project.name, projectSlug));
            const logOrError = Log.create({ ...input, projectId: project.getId() });
            if (logOrError.isLeft()) return left(logOrError.value);
            const newLog = await this.logRepository.save(logOrError.value);
            this.webSocket.send({
                event: "registered-log",
                data: {
                    id: newLog.getId(),
                    type: newLog.type,
                    projectId: newLog.projectId,
                    path: newLog.method,
                    statusCode: newLog.statusCode,
                    statusText: newLog.statusText,
                    externalId: newLog.externalId,
                    level: newLog.level,
                    duration: newLog.duration,
                    createdAt: newLog.createdAt,
                },
            });
            return right({ logId: newLog.getId() });
        });
    }
}
