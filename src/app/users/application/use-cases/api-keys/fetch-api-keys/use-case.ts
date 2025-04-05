import { QueryOptions } from "ts-arch-kit/dist/database";

import { GenericFetchUseCase } from "@/app/_common/application/crud";
import { APIKey } from "@/app/users/domain/models/api-key";

import { FetchAPIKeysUseCaseGateway, FetchAPIKeysUseCaseInput } from "./types";

export class FetchAPIKeysUseCase extends GenericFetchUseCase<APIKey, FetchAPIKeysUseCaseInput> {
    constructor({ repositoryFactory }: FetchAPIKeysUseCaseGateway) {
        super(repositoryFactory, repositoryFactory.createAPIKeyRepository);
    }

    protected queryOptions({ queryOptions, requestUser }: FetchAPIKeysUseCaseInput): QueryOptions | undefined {
        const { filter, ...rest } = queryOptions || {};
        return { ...rest, filter: { ...filter, userId: requestUser.getId() } };
    }
}
