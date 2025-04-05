import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { User, UserToken } from "@/app/users/domain/models/user";

import { IUserRepository, IUserTokenRepository } from "../../../repos";
import { ActivateUserUseCaseGateway, ActivateUserUseCaseInput, ActivateUserUseCaseOutput } from "./types";

export class ActivateUserUseCase extends UseCase<ActivateUserUseCaseInput, ActivateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private userTokenRepository: IUserTokenRepository;

    constructor({ repositoryFactory }: ActivateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.userTokenRepository = repositoryFactory.createUserTokenRepository();
        this.unitOfWork.prepare(this.userRepository, this.userTokenRepository);
    }

    protected async impl({ token }: ActivateUserUseCaseInput): Promise<ActivateUserUseCaseOutput> {
        if (!token) return left(new MissingParamError("token", "path"));
        return this.unitOfWork.execute<ActivateUserUseCaseOutput>(async () => {
            const userToken = await this.userTokenRepository.findOne({ filter: { token } });
            if (!userToken || !userToken.isActivation()) return left(new NotFoundModelError(UserToken.name, token));
            const user = await this.userRepository.findById(userToken.userId);
            if (!user) return left(new NotFoundModelError(User.name, userToken.userId));
            user.activate();
            await this.userRepository.save(user);
            await this.userTokenRepository.destroy(userToken);
            return right(undefined);
        });
    }
}
