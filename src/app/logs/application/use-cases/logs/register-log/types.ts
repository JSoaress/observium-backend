import { Either } from "ts-arch-kit/dist/core/helpers";

import { ForbiddenError, NotFoundModelError, ValidationError } from "@/app/_common/errors";
import { CreateLogDTO } from "@/app/logs/domain/models/log";
import { IRepositoryFactory } from "@/infra/database";
import { IWebSocket } from "@/infra/socket";

export type RegisterLogUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    webSocket: IWebSocket;
};

export type RegisterLogUseCaseInput = Omit<CreateLogDTO, "projectId"> & {
    projectSlug: string;
};

export type RegisteredLog = { logId: string };

export type RegisterLogUseCaseOutput = Either<ValidationError | NotFoundModelError | ForbiddenError, RegisteredLog>;
