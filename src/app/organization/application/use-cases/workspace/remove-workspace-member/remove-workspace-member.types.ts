import { Either } from "ts-arch-kit/dist/core/helpers";

import { NotFoundModelError, RemoveMembershipInWorkspaceError, ValidationError } from "@/app/_common/errors";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type RemoveWorkspaceMemberUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type RemoveWorkspaceMemberUseCaseInput = {
    workspace: string;
    member: string;
    requestUser: User;
};

export type RemoveWorkspaceMemberUseCaseOutput = Either<
    NotFoundModelError | ValidationError | RemoveMembershipInWorkspaceError,
    void
>;
