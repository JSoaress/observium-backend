import { Either } from "ts-arch-kit/dist/core/helpers";

import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { Log } from "@/app/logs/domain/models/log";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetLogByIdUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetLogByIdUseCaseInput = {
    id: string;
    requestUser: User;
};

export type GetLogByIdUseCaseOutput = Either<MissingParamError | NotFoundModelError, Log>;
