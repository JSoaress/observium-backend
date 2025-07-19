import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { ConflictError, ForbiddenError, NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { Project } from "@/app/projects/domain/models/project";

import { IProjectRepository } from "../../../repos";
import { CreateProjectUseCaseGateway, CreateProjectUseCaseInput, CreateProjectUseCaseOutput } from "./create-project.types";

export class CreateProjectUseCase extends UseCase<CreateProjectUseCaseInput, CreateProjectUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;

    constructor({ repositoryFactory }: CreateProjectUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository);
    }

    protected async impl(input: CreateProjectUseCaseInput): Promise<CreateProjectUseCaseOutput> {
        return this.unitOfWork.execute<CreateProjectUseCaseOutput>(async () => {
            const { workspace: workspaceId, requestUser, ...rest } = input;
            const workspace = await this.workspaceRepository.findById(workspaceId);
            if (!workspace) return left(new NotFoundModelError(Workspace.name, workspaceId));
            const belongsToWorkspace = workspace.userBelongsToWorkspace(requestUser);
            if (!belongsToWorkspace)
                return left(new ForbiddenError(`Você não faz parte da workspace ${workspace.get("name")}.`));
            const canCreateProject = workspace.checkUserPermissionInWorkspace(requestUser, "member");
            if (!canCreateProject) {
                const msg = `Você não tem permissão para criar projetos na workspace ${workspace.get("name")}.`;
                return left(new ForbiddenError(msg));
            }
            const projectOrError = Project.create({ ...rest, workspaceId });
            if (projectOrError.isLeft()) return left(projectOrError.value);
            const unsavedProject = projectOrError.value;
            const slugInUse = await this.projectRepository.exists({
                slug: unsavedProject.get("slug"),
                workspaceId: unsavedProject.get("workspaceId"),
            });
            if (slugInUse) {
                const msg = `Já existe outro projeto usando a slug "${unsavedProject.get(
                    "slug"
                )}" na workspace ${workspace.get("name")}.`;
                return left(new ConflictError(msg));
            }
            const newProject = await this.projectRepository.save(projectOrError.value);
            return right(newProject);
        });
    }
}
