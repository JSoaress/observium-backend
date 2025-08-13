import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { ForbiddenError, NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { APIKey } from "@/app/projects/domain/models/api-key";
import { Project } from "@/app/projects/domain/models/project";

import { IProjectRepository, IAPIKeyRepository } from "../../../repos";
import { CreateAPIKeyUseCaseGateway, CreateAPIKeyUseCaseInput, CreateAPIKeyUseCaseOutput } from "./create-api-key-types";

export class CreateAPIKeyUseCase extends UseCase<CreateAPIKeyUseCaseInput, CreateAPIKeyUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;
    private apiKeyRepository: IAPIKeyRepository;

    constructor({ repositoryFactory }: CreateAPIKeyUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.apiKeyRepository = repositoryFactory.createAPIKeyRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository, this.apiKeyRepository);
    }

    protected impl({ requestUser, ...input }: CreateAPIKeyUseCaseInput): Promise<CreateAPIKeyUseCaseOutput> {
        return this.unitOfWork.execute<CreateAPIKeyUseCaseOutput>(async () => {
            const apiKeyOrError = APIKey.create(input);
            if (apiKeyOrError.isLeft()) return left(apiKeyOrError.value);
            const project = await this.projectRepository.findById(input.projectId);
            if (!project) return left(new NotFoundModelError(Project.name, input.projectId));
            const workspace = await this.workspaceRepository.findById(project.get("workspaceId"));
            if (!workspace) return left(new NotFoundModelError(Workspace.name, project.get("workspaceId")));
            if (!workspace.checkUserPermissionInWorkspace(requestUser, "member"))
                return left(new ForbiddenError(`Você não faz parte da workspace ${workspace.get("name")}.`));
            const newApiKey = await this.apiKeyRepository.save(apiKeyOrError.value);
            return right(newApiKey);
        });
    }
}
