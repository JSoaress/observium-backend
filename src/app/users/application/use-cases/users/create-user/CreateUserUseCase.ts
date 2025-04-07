import { resolve } from "node:path";
import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { EmailTakenError } from "@/app/_common/errors";
import { User, UserToken } from "@/app/users/domain/models/user";
import { IMail } from "@/infra/providers/mail";
import { env } from "@/shared/config/environment";

import { IUserRepository, IUserTokenRepository } from "../../../repos";
import { CreateUserUseCaseGateway, CreateUserUseCaseInput, CreateUserUseCaseOutput } from "./types";

export class CreateUserUseCase extends UseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private userTokenRepository: IUserTokenRepository;
    private mailProvider: IMail;

    constructor({ repositoryFactory, mailProvider }: CreateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.userTokenRepository = repositoryFactory.createUserTokenRepository();
        this.unitOfWork.prepare(this.userRepository, this.userTokenRepository);
        this.mailProvider = mailProvider;
    }

    protected async impl(input: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput> {
        return this.unitOfWork.execute<CreateUserUseCaseOutput>(async () => {
            const userOrError = await User.create(input);
            if (userOrError.isLeft()) return left(userOrError.value);
            const user = userOrError.value;
            const emailInUse = await this.userRepository.exists({ email: user.email });
            if (emailInUse) return left(new EmailTakenError(user.email));
            const newUser = await this.userRepository.save(user);
            const userTokenOrError = UserToken.createActivation({ user: newUser });
            if (userTokenOrError.isLeft()) return left(userTokenOrError.value);
            const newUserToken = await this.userTokenRepository.save(userTokenOrError.value);
            const templatePath = resolve(__dirname, "..", "..", "..", "views", "emails", "activate-account.hbs");
            const variables = {
                platform: env.platformName,
                name: newUser.name,
                activationLink: `${env.webUrl}/auth/activation-account/${newUserToken.token}`,
                year: new Date().getFullYear(),
            };
            await this.mailProvider.sendMail(newUser.email, "Ativação conta Observium", templatePath, variables);
            return right(newUser);
        });
    }
}
