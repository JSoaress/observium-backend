import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { ForbiddenError, NotFoundModelError } from "@/app/_common/errors";
import { APIKey } from "@/app/projects/domain/models/api-key";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type FetchAPIKeysByUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchAPIKeysByUserUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: User;
};

export type FetchAPIKeysByUserUseCaseOutput = Either<NotFoundModelError | ForbiddenError, Pagination<APIKey>>;
