import { Either } from "ts-arch-kit/dist/core/helpers";

import { ConflictError, ForbiddenError, NotFoundModelError, ValidationError } from "@/app/_common/errors";
import { CreateProjectDTO, Project } from "@/app/projects/domain/models/project";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateProjectUseCaseInput = Omit<CreateProjectDTO, "workspaceId"> & {
    workspace: string;
    requestUser: User;
};

export type CreateProjectUseCaseOutput = Either<
    NotFoundModelError | ForbiddenError | ValidationError | ConflictError,
    Project
>;
