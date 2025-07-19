import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { UnknownError } from "@/app/_common/errors";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetUserMembershipWorkspaceUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetUserMembershipWorkspaceUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: User;
};

export type GetUserMembershipWorkspaceUseCaseOutput = Either<UnknownError, Pagination<Workspace>>;
