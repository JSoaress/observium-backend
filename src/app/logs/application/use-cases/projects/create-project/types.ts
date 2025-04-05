import { Either } from "ts-arch-kit/dist/core/helpers";

import { ConflictError, ValidationError } from "@/app/_common/errors";
import { CreateProjectDTO, Project } from "@/app/logs/domain/models/project";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateProjectUseCaseInput = Omit<CreateProjectDTO, "userId"> & {
    requestUser: User;
};

export type CreateProjectUseCaseOutput = Either<ValidationError | ConflictError, Project>;
