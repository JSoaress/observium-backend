import { randomBytes } from "node:crypto";
import { Either } from "ts-arch-kit/dist/core/helpers";

import { GenericCreateUseCase } from "@/app/_common/application/crud";
import { ValidationError } from "@/app/_common/errors";
import { APIKey } from "@/app/users/domain/models/api-key";

import { CreateAPIKeyUseCaseGateway, CreateAPIKeyUseCaseInput } from "./types";

export class CreateAPIKeyUseCase extends GenericCreateUseCase<APIKey, CreateAPIKeyUseCaseInput> {
    constructor({ repositoryFactory }: CreateAPIKeyUseCaseGateway) {
        super(APIKey, repositoryFactory, repositoryFactory.createAPIKeyRepository);
    }

    protected async validateCreate(input: CreateAPIKeyUseCaseInput): Promise<Either<ValidationError, APIKey>> {
        const { requestUser, ...props } = input;
        const key = `api_${randomBytes(32).toString("hex")}`;
        return APIKey.create({ ...props, key, userId: requestUser.getId() });
    }
}
