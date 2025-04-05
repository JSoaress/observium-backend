import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { NotFoundModelError, UnknownError } from "@/app/_common/errors";
import { LogSimplifiedDTO } from "@/app/logs/domain/models/log";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type FetchLogsUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchLogsUseCaseInput = {
    projectId: string;
    queryOptions?: QueryOptions;
    requestUser: User;
};

export type FetchLogsUseCaseOutput = Either<NotFoundModelError | UnknownError, Pagination<LogSimplifiedDTO>>;
