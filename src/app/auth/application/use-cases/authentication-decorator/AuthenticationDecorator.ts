import { IUseCase } from "ts-arch-kit/dist/core/application";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, left } from "ts-arch-kit/dist/core/helpers";

import { UseCase } from "@/app/_common";
import { CheckAPIKeyUseCase } from "@/app/users/application/use-cases/api-keys/check-api-key";
import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

import { CheckAuthenticatedUserUseCase } from "../check-authenticated-user";
import { AuthenticationDecoratorGateway, AuthenticationDecoratorInput } from "./types";

export class AuthenticationDecorator<TInput, TOutput extends Either<BasicError, unknown>> extends UseCase<
    AuthenticationDecoratorInput<TInput>,
    TOutput
> {
    private repositoryFactory: IRepositoryFactory;
    private jwtAdapter: IJwt;
    private useCase: IUseCase<TInput, TOutput>;

    constructor({ useCase, repositoryFactory, jwtAdapter }: AuthenticationDecoratorGateway) {
        super();
        this.repositoryFactory = repositoryFactory;
        this.jwtAdapter = jwtAdapter;
        this.useCase = useCase;
    }

    protected async impl({ requestUserToken, ...input }: AuthenticationDecoratorInput<TInput>): Promise<TOutput> {
        const [prefix, token] = requestUserToken.split(" ");
        if (prefix?.toLowerCase() === "apikey") {
            const authenticateUseCase = new CheckAPIKeyUseCase({ repositoryFactory: this.repositoryFactory });
            const authenticateOrError = await authenticateUseCase.execute({ key: token });
            if (authenticateOrError.isLeft()) return left(authenticateOrError.value) as TOutput;
            const requestUser = authenticateOrError.value;
            return this.useCase.execute({ ...input, requestUser } as TInput);
        }
        const authenticateUseCase = new CheckAuthenticatedUserUseCase({
            repositoryFactory: this.repositoryFactory,
            jwtAdapter: this.jwtAdapter,
        });
        const authenticateOrError = await authenticateUseCase.execute({ requestUserToken: token });
        if (authenticateOrError.isLeft()) return left(authenticateOrError.value) as TOutput;
        const requestUser = authenticateOrError.value;
        return this.useCase.execute({ ...input, requestUser } as TInput);
    }
}
