import { Either } from "ts-arch-kit/dist/core/helpers";

import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { IRepositoryFactory } from "@/infra/database";

export type ActivateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type ActivateUserUseCaseInput = {
    token: string;
};

export type ActivateUserUseCaseOutput = Either<MissingParamError | NotFoundModelError, void>;
