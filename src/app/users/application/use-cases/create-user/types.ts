import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError, UnknownError, ValidationError } from "@/app/_common/errors";
import { CreateUserDTO, User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export type CreateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    mailProvider: IMail;
};

export type CreateUserUseCaseInput = CreateUserDTO;

export type CreateUserUseCaseOutput = Either<ValidationError | InvalidPasswordError | UnknownError, User>;
