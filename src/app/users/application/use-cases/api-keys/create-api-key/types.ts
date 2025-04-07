import { Either } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common/errors";
import { APIKey, CreateAPIKeyDTO } from "@/app/users/domain/models/api-key";
import { User } from "@/app/users/domain/models/user";
import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

export type CreateAPIKeyUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    jwtAdapter: IJwt;
};

export type CreateAPIKeyUseCaseInput = Omit<CreateAPIKeyDTO, "userId"> & {
    requestUser: User;
};

export type CreateAPIKeyUseCaseOutput = Either<ValidationError, APIKey>;
