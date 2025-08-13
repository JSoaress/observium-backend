import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { InvalidAPIKeyError, MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { APIKey } from "@/app/projects/domain/models/api-key";
import { Project } from "@/app/projects/domain/models/project";
import { UUID } from "@/shared/helpers";

import { IAPIKeyRepository, IProjectRepository } from "../../../repos";
import { CheckAPIKeyUseCaseGateway, CheckAPIKeyUseCaseInput, CheckAPIKeyUseCaseOutput } from "./check-api-key-types";

export class CheckAPIKeyUseCase extends UseCase<CheckAPIKeyUseCaseInput, CheckAPIKeyUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;
    private apiKeyRepository: IAPIKeyRepository;

    constructor({ repositoryFactory }: CheckAPIKeyUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.apiKeyRepository = repositoryFactory.createAPIKeyRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository, this.apiKeyRepository);
    }

    protected async impl({ key, projectIdOrSlug }: CheckAPIKeyUseCaseInput): Promise<CheckAPIKeyUseCaseOutput> {
        if (!key) return left(new MissingParamError("key"));
        return this.unitOfWork.execute<CheckAPIKeyUseCaseOutput>(async () => {
            // TODO: construir um metodo unico para buscar projeto por ID ou slug
            let project = await this.projectRepository.findOne({ filter: { slug: projectIdOrSlug } });
            if (!project && UUID.validate(projectIdOrSlug)) project = await this.projectRepository.findById(projectIdOrSlug);
            if (!project) return left(new NotFoundModelError(Project.name, projectIdOrSlug));
            const apiKey = await this.apiKeyRepository.findOne({ filter: { key, projectId: project.getId() } });
            if (!apiKey) return left(new NotFoundModelError(APIKey.name, { key }));
            if (!apiKey.isValid()) return left(new InvalidAPIKeyError("Essa chave de API está inativa ou expirada."));
            return right({ valid: true });
        });
    }
}
