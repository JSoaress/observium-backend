import { IUseCase } from "ts-arch-kit/dist/core/application";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, left } from "ts-arch-kit/dist/core/helpers";

import { UseCase } from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";

import { CheckAPIKeyUseCase } from "../check-api-key/check-api-key.usecase";
import { CheckAPIKeyDecoratorGateway, CheckAPIKeyDecoratorInput } from "./check-api-key-types";

export class CheckAPIKeyDecorator<TInput, TOutput extends Either<BasicError, unknown>> extends UseCase<
    CheckAPIKeyDecoratorInput<TInput>,
    TOutput
> {
    private repositoryFactory: IRepositoryFactory;
    private useCase: IUseCase<TInput, TOutput>;

    constructor({ useCase, repositoryFactory }: CheckAPIKeyDecoratorGateway) {
        super();
        this.repositoryFactory = repositoryFactory;
        this.useCase = useCase;
    }

    protected async impl(input: CheckAPIKeyDecoratorInput<TInput>): Promise<TOutput> {
        const { projectIdOrSlug, key } = input;
        const [, token] = key.split(" ");
        const useCase = new CheckAPIKeyUseCase({ repositoryFactory: this.repositoryFactory });
        const validAPIKeyOrError = await useCase.execute({ projectIdOrSlug, key: token });
        if (validAPIKeyOrError.isLeft()) return left(validAPIKeyOrError.value) as TOutput;
        return this.useCase.execute(input);
    }
}
