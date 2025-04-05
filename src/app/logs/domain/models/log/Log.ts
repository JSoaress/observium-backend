import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateLogDTO, LogDTO, LogSchema, RestoreLogDTO } from "./LogDTO";

export class Log extends Model<LogDTO> {
    private constructor(props: LogDTO) {
        super(props);
    }

    static create(props: CreateLogDTO): Either<ValidationError, Log> {
        const validDataOrError = ZodValidator.validate({ ...props, createdAt: new Date() }, LogSchema);
        if (!validDataOrError.success) return left(new ValidationError(Log.name, validDataOrError.errors));
        return right(new Log(validDataOrError.data));
    }

    static restore(props: RestoreLogDTO) {
        return new Log(props);
    }

    get type() {
        return this.props.type;
    }

    get projectId() {
        return this.props.projectId;
    }

    get path() {
        return this.props.path;
    }

    get method() {
        return this.props.method;
    }

    get statusCode() {
        return this.props.statusCode;
    }

    get statusText() {
        return this.props.statusText;
    }

    get level() {
        return this.props.level;
    }

    get duration() {
        return this.props.duration;
    }

    get context() {
        return this.props.context;
    }

    get response() {
        return this.props.response;
    }

    get error() {
        return this.props.error;
    }

    get createdAt() {
        return this.props.createdAt;
    }
}
