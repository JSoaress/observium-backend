import { Either } from "ts-arch-kit/dist/core/helpers";

import { ForbiddenError, NotFoundModelError, ValidationError } from "@/app/_common/errors";
import { CreateLogDTO } from "@/app/logs/domain/models/log";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { IWebSocket } from "@/infra/socket";

export type RegisterLogUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    webSocket: IWebSocket;
};

export type RegisterLogUseCaseInput = Omit<CreateLogDTO, "projectId"> & {
    projectSlug: string;
    requestUser: User;
};

export type RegisteredLog = { logId: string };

export type RegisterLogUseCaseOutput = Either<ValidationError | NotFoundModelError | ForbiddenError, RegisteredLog>;
