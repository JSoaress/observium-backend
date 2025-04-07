import { QueryOptions } from "ts-arch-kit/dist/database";

import { GenericFetchUseCase } from "@/app/_common/application/crud";
import { Project } from "@/app/logs/domain/models/project";

import { FetchProjectsUseCaseGateway, FetchProjectsUseCaseInput } from "./types";

export class FetchProjectsUseCase extends GenericFetchUseCase<Project, FetchProjectsUseCaseInput> {
    constructor({ repositoryFactory }: FetchProjectsUseCaseGateway) {
        super(repositoryFactory, repositoryFactory.createProjectRepository);
    }

    protected queryOptions({ queryOptions, requestUser }: FetchProjectsUseCaseInput): QueryOptions | undefined {
        const { filter, ...rest } = queryOptions || {};
        return { ...rest, filter: { ...filter, userId: requestUser.getId() } };
    }
}
