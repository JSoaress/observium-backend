import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidAPIKeyError, MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { IRepositoryFactory } from "@/infra/database";

export type CheckAPIKeyUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CheckAPIKeyUseCaseInput = {
    key: string;
    projectIdOrSlug: string;
};

export type CheckAPIKeyUseCaseOutput = Either<MissingParamError | NotFoundModelError | InvalidAPIKeyError, { valid: true }>;
