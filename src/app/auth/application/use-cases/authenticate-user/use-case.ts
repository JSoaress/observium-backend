import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { InvalidCredentialsError, MissingParamError } from "@/app/_common/errors";
import { IUserRepository } from "@/app/users/application/repos";
import { IJwt } from "@/infra/adapters/jwt";

import { AuthenticateUserUseCaseGateway, AuthenticateUserUseCaseInput, AuthenticateUserUseCaseOutput } from "./types";

export class AuthenticateUserUseCase extends UseCase<AuthenticateUserUseCaseInput, AuthenticateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private jwtAdapter: IJwt;

    constructor({ repositoryFactory, jwtAdapter }: AuthenticateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.jwtAdapter = jwtAdapter;
    }

    protected async impl(input: AuthenticateUserUseCaseInput): Promise<AuthenticateUserUseCaseOutput> {
        if (!input.email || !input.password) {
            const param = !input.email ? "email" : "password";
            return left(new MissingParamError(param, "body"));
        }
        return this.unitOfWork.execute<AuthenticateUserUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { email: input.email } });
            if (!user) return left(new InvalidCredentialsError());
            const matchPassword = await user.verifyPassword(input.password);
            if (!matchPassword) return left(new InvalidCredentialsError());
            const accessToken = this.jwtAdapter.generate(user.email, "secret-observium", "24h");
            return right({
                accessToken,
                refreshToken: "",
                user: {
                    name: user.name,
                    email: user.email,
                },
            });
        });
    }
}
