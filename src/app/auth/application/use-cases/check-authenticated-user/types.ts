import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidTokenError, MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { User } from "@/app/users/domain/models/user";
import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

export type CheckAuthenticatedUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    jwtAdapter: IJwt;
};

export type CheckAuthenticatedUserUseCaseInput = {
    requestUserToken: string;
};

export type CheckAuthenticatedUserUseCaseOutput = Either<MissingParamError | InvalidTokenError | NotFoundModelError, User>;
