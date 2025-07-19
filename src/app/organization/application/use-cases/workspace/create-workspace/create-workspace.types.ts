import { Either } from "ts-arch-kit/dist/core/helpers";

import { AddMembershipInWorkspaceError, ValidationError } from "@/app/_common/errors";
import { CreateWorkspaceDTO, Workspace } from "@/app/organization/domain/models/workspace";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateWorkspaceUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateWorkspaceUseCaseInput = Omit<CreateWorkspaceDTO, "ownerId"> & {
    requestUser: User;
};

export type CreateWorkspaceUseCaseOutput = Either<ValidationError | AddMembershipInWorkspaceError, Workspace>;
