import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { IUserRepository } from "@/app/users/application/repos";
import { User } from "@/app/users/domain/models/user";
import { IJwt } from "@/infra/adapters/jwt";

import { AuthenticateUserUseCaseGateway } from "../authenticate-user";
import { CheckAuthenticatedUserUseCaseInput, CheckAuthenticatedUserUseCaseOutput } from "./types";

export class CheckAuthenticatedUserUseCase extends UseCase<
    CheckAuthenticatedUserUseCaseInput,
    CheckAuthenticatedUserUseCaseOutput
> {
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

    protected async impl(input: CheckAuthenticatedUserUseCaseInput): Promise<CheckAuthenticatedUserUseCaseOutput> {
        if (!input.requestUserToken) return left(new MissingParamError("requestUserToken"));
        return this.unitOfWork.execute<CheckAuthenticatedUserUseCaseOutput>(async () => {
            const decodedTokenOrError = this.jwtAdapter.verify(input.requestUserToken, "secret-observium");
            if (decodedTokenOrError.isLeft()) return left(decodedTokenOrError.value);
            const email = decodedTokenOrError.value;
            const user = await this.userRepository.findOne({ filter: { email } });
            if (!user) return left(new NotFoundModelError(User.name, email));
            return right(user);
        });
    }
}
