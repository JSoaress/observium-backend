import { Either } from "ts-arch-kit/dist/core/helpers";

import { GenericCreateUseCase } from "@/app/_common/application/crud";
import { ValidationError } from "@/app/_common/errors";
import { APIKey } from "@/app/users/domain/models/api-key";
import { IJwt } from "@/infra/adapters/jwt";
import { env } from "@/shared/config/environment";

import { CreateAPIKeyUseCaseGateway, CreateAPIKeyUseCaseInput } from "./types";

export class CreateAPIKeyUseCase extends GenericCreateUseCase<APIKey, CreateAPIKeyUseCaseInput> {
    private jwtAdapter: IJwt;

    constructor({ repositoryFactory, jwtAdapter }: CreateAPIKeyUseCaseGateway) {
        super(APIKey, repositoryFactory, repositoryFactory.createAPIKeyRepository);
        this.jwtAdapter = jwtAdapter;
    }

    protected async validateCreate(input: CreateAPIKeyUseCaseInput): Promise<Either<ValidationError, APIKey>> {
        const { requestUser, ...props } = input;
        const key = this.jwtAdapter.generate(requestUser.email, env.apiKeySecret);
        return APIKey.create({ ...props, key, userId: requestUser.getId() });
    }
}
