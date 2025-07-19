import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateProjectDTO, ProjectDTO, ProjectSchema, RestoreProjectDTO } from "./project.dto";

export class Project extends Model<ProjectDTO> {
    static create(props: CreateProjectDTO): Either<ValidationError, Project> {
        const validDataOrError = ZodValidator.validate(props, ProjectSchema);
        if (!validDataOrError.success) return left(new ValidationError(Project.name, validDataOrError.errors));
        return right(new Project(validDataOrError.data));
    }

    static restore(props: RestoreProjectDTO) {
        return new Project(props);
    }
}
