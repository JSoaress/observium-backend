import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { IWorkspaceRepository } from "@/app/organization/application/repos";

import { IAPIKeyRepository, IProjectRepository } from "../../../repos";
import {
    FetchAPIKeysByUserUseCaseGateway,
    FetchAPIKeysByUserUseCaseInput,
    FetchAPIKeysByUserUseCaseOutput,
} from "./fetch-api-keys-by-user.types";

export class FetchAPIKeysByUserUseCase extends UseCase<FetchAPIKeysByUserUseCaseInput, FetchAPIKeysByUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;
    private apiKeyRepository: IAPIKeyRepository;

    constructor({ repositoryFactory }: FetchAPIKeysByUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.apiKeyRepository = repositoryFactory.createAPIKeyRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository, this.apiKeyRepository);
    }

    protected async impl({
        queryOptions,
        requestUser,
    }: FetchAPIKeysByUserUseCaseInput): Promise<FetchAPIKeysByUserUseCaseOutput> {
        return this.unitOfWork.execute<FetchAPIKeysByUserUseCaseOutput>(async () => {
            const workspaces = await this.workspaceRepository.getByUser(requestUser);
            const workspaceIds = workspaces.map((workspace) => workspace.getId());
            const projects = await this.projectRepository.find({ filter: { workspaceId: { $in: workspaceIds } } });
            const projectIds = projects.map((project) => project.getId());
            const filter = { ...queryOptions?.filter, projectId: { $in: projectIds } };
            const count = await this.apiKeyRepository.count(filter);
            const apiKeys = await this.apiKeyRepository.find({ ...queryOptions, filter });
            return right({ count, results: apiKeys });
        });
    }
}
