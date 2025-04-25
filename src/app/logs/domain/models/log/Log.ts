import { Either, left, parseNumber, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateLogDTO, LogDTO, LogSchema, LogSimplifiedDTO, RestoreLogDTO } from "./LogDTO";

export class Log extends Model<LogDTO> {
    private constructor(props: LogDTO) {
        super(props);
    }

    static create(props: CreateLogDTO): Either<ValidationError, Log> {
        const validDataOrError = ZodValidator.validate({ ...props, createdAt: new Date() }, LogSchema);
        if (!validDataOrError.success) return left(new ValidationError(Log.name, validDataOrError.errors));
        const { context } = validDataOrError.data;
        return right(new Log({ ...validDataOrError.data, type: context.type, duration: (context.duration as number) || 0 }));
    }

    static restore(props: RestoreLogDTO) {
        return new Log(props);
    }

    get type() {
        return this.props.context.type;
    }

    get projectId() {
        return this.props.projectId;
    }

    get externalId() {
        return this.props.externalId;
    }

    get level() {
        return this.props.level;
    }

    get message() {
        return this.props.message;
    }

    get context() {
        return this.props.context;
    }

    get duration() {
        return parseNumber(this.context.duration);
    }

    get error() {
        return this.props.error;
    }

    get stack() {
        return this.props.stack;
    }

    get tags() {
        return this.props.tags;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    getSimplified(): LogSimplifiedDTO {
        return {
            id: this.getId(),
            type: this.type,
            projectId: this.projectId,
            externalId: this.externalId,
            level: this.level,
            message: this.message,
            duration: this.duration,
            tags: this.tags,
            createdAt: this.createdAt,
        };
    }
}
