import { Either } from "ts-arch-kit/dist/core/helpers";

import { AddMembershipInWorkspaceError, NotFoundModelError, ValidationError } from "@/app/_common/errors";
import { WorkspaceMembershipRoles } from "@/app/organization/domain/models/workspace/workspace-membership.dto";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type AddMemberInWorkspaceUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type AddMemberInWorkspaceUseCaseInput = {
    workspace: string;
    userId: string;
    role: WorkspaceMembershipRoles;
    requestUser: User;
};

export type AddMemberInWorkspaceUseCaseOutput = Either<
    NotFoundModelError | ValidationError | AddMembershipInWorkspaceError,
    void
>;
