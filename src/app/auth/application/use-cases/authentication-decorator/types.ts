/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUseCase } from "ts-arch-kit/dist/core/application";

import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

import { CheckAuthenticatedUserUseCaseInput } from "../check-authenticated-user";

export type AuthenticationDecoratorGateway = {
    repositoryFactory: IRepositoryFactory;
    jwtAdapter: IJwt;
    useCase: IUseCase<any, any>;
};

export type AuthenticationDecoratorInput<TInput> = CheckAuthenticatedUserUseCaseInput & TInput;
