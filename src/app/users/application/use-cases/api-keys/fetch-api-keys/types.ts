import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { UnknownError } from "@/app/_common/errors";
import { APIKey } from "@/app/users/domain/models/api-key";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type FetchAPIKeysUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchAPIKeysUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: User;
};

export type FetchAPIKeysUseCaseOutput = Either<UnknownError, Pagination<APIKey>>;
