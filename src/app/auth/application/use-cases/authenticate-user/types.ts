import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidCredentialsError, MissingParamError } from "@/app/_common/errors";
import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

export type AuthenticateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    jwtAdapter: IJwt;
};

export type AuthenticateUserUseCaseInput = {
    email: string;
    password: string;
};

export type AuthenticatedUser = {
    accessToken: string;
    refreshToken: string;
    user: {
        name: string;
        email: string;
    };
};

export type AuthenticateUserUseCaseOutput = Either<MissingParamError | InvalidCredentialsError, AuthenticatedUser>;
