/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUseCase } from "ts-arch-kit/dist/core/application";

import { IRepositoryFactory } from "@/infra/database";

import { CheckAPIKeyUseCaseInput } from "../check-api-key/check-api-key-types";

export type CheckAPIKeyDecoratorGateway = {
    repositoryFactory: IRepositoryFactory;
    useCase: IUseCase<any, any>;
};

export type CheckAPIKeyDecoratorInput<TInput> = CheckAPIKeyUseCaseInput & TInput;
