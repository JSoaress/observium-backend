import { Either, left } from "ts-arch-kit/dist/core/helpers";

import { GenericCreateUseCase } from "@/app/_common/application/crud";
import { ConflictError, ValidationError } from "@/app/_common/errors";
import { Project } from "@/app/logs/domain/models/project";

import { CreateProjectUseCaseGateway, CreateProjectUseCaseInput } from "./types";

export class CreateProjectUseCase extends GenericCreateUseCase<Project, CreateProjectUseCaseInput> {
    constructor({ repositoryFactory }: CreateProjectUseCaseGateway) {
        super(Project, repositoryFactory, repositoryFactory.createProjectRepository);
    }

    protected async validateCreate(input: CreateProjectUseCaseInput): Promise<Either<ValidationError, Project>> {
        const { requestUser, ...props } = input;
        return Project.create({ ...props, userId: requestUser.getId() });
    }

    protected async beforeCreate(project: Project): Promise<Either<ConflictError, Project>> {
        const slugInUse = await this.repository.exists({ slug: project.slug, userId: project.userId });
        if (slugInUse) return left(new ConflictError(`Você já possui outro projeto usando a slug "${project.slug}".`));
        return super.beforeCreate(project);
    }
}
