import { Either } from "ts-arch-kit/dist/core/helpers";

import { ForbiddenError, NotFoundModelError, ValidationError } from "@/app/_common/errors";
import { APIKey, CreateAPIKeyDTO } from "@/app/projects/domain/models/api-key";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateAPIKeyUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateAPIKeyUseCaseInput = CreateAPIKeyDTO & {
    requestUser: User;
};

export type CreateAPIKeyUseCaseOutput = Either<ValidationError | NotFoundModelError | ForbiddenError, APIKey>;
