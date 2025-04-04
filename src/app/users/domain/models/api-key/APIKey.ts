import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { APIKeyDTO, CreateAPIKeyDTO, APIKeySchema, RestoreAPIKeyDTO } from "./APIKeyDTO";

export class APIKey extends Model<APIKeyDTO> {
    private constructor(props: APIKeyDTO) {
        super(props);
    }

    static create(props: CreateAPIKeyDTO): Either<ValidationError, APIKey> {
        const validDataOrError = ZodValidator.validate(props, APIKeySchema);
        if (!validDataOrError.success) return left(new ValidationError(APIKey.name, validDataOrError.errors));
        return right(new APIKey(validDataOrError.data));
    }

    static restore(props: RestoreAPIKeyDTO) {
        return new APIKey(props);
    }

    get alias() {
        return this.props.alias;
    }

    get key() {
        return this.props.key;
    }

    get userId() {
        return this.props.userId;
    }

    get expiresIn() {
        return this.props.expiresIn;
    }

    get active() {
        return this.props.active;
    }
}
