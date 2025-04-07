import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { InvalidAPIKeyError, MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { APIKey } from "@/app/users/domain/models/api-key";
import { User } from "@/app/users/domain/models/user";

import { IAPIKeyRepository, IUserRepository } from "../../../repos";
import { CheckAPIKeyUseCaseGateway, CheckAPIKeyUseCaseInput, CheckAPIKeyUseCaseOutput } from "./types";

export class CheckAPIKeyUseCase extends UseCase<CheckAPIKeyUseCaseInput, CheckAPIKeyUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private apiKeyRepository: IAPIKeyRepository;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: CheckAPIKeyUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.apiKeyRepository = repositoryFactory.createAPIKeyRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.apiKeyRepository, this.userRepository);
    }

    protected async impl({ key }: CheckAPIKeyUseCaseInput): Promise<CheckAPIKeyUseCaseOutput> {
        if (!key) return left(new MissingParamError("key"));
        return this.unitOfWork.execute<CheckAPIKeyUseCaseOutput>(async () => {
            const apiKey = await this.apiKeyRepository.findOne({ filter: { key } });
            if (!apiKey) return left(new NotFoundModelError(APIKey.name, { key }));
            if (!apiKey.isValid()) return left(new InvalidAPIKeyError("Essa chave de API está inativa ou expirada."));
            const user = await this.userRepository.findById(apiKey.userId);
            if (!user) return left(new NotFoundModelError(User.name, apiKey.userId));
            return right(user);
        });
    }
}
