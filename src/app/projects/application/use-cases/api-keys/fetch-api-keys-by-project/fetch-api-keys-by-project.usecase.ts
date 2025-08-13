import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { ForbiddenError, NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { Project } from "@/app/projects/domain/models/project";

import { IAPIKeyRepository, IProjectRepository } from "../../../repos";
import {
    FetchAPIKeysUseCaseGateway,
    FetchAPIKeysUseCaseInput,
    FetchAPIKeysUseCaseOutput,
} from "./fetch-api-keys-by-project.types";

export class FetchAPIKeysUseCase extends UseCase<FetchAPIKeysUseCaseInput, FetchAPIKeysUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;
    private apiKeyRepository: IAPIKeyRepository;

    constructor({ repositoryFactory }: FetchAPIKeysUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.apiKeyRepository = repositoryFactory.createAPIKeyRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository, this.apiKeyRepository);
    }

    protected async impl(input: FetchAPIKeysUseCaseInput): Promise<FetchAPIKeysUseCaseOutput> {
        return this.unitOfWork.execute<FetchAPIKeysUseCaseOutput>(async () => {
            const project = await this.projectRepository.findById(input.project);
            if (!project) return left(new NotFoundModelError(Project.name, input.project));
            const workspace = await this.workspaceRepository.findById(project.get("workspaceId"));
            if (!workspace) return left(new NotFoundModelError(Workspace.name, project.get("workspaceId")));
            if (!workspace.userBelongsToWorkspace(input.requestUser))
                return left(new ForbiddenError(`Você não faz parte da workspace ${workspace.get("name")}.`));
            const filter = { ...input.queryOptions?.filter, projectId: project.getId() };
            const count = await this.apiKeyRepository.count(filter);
            const apiKeys = await this.apiKeyRepository.find({ ...input.queryOptions, filter });
            return right({ count, results: apiKeys });
        });
    }
}
