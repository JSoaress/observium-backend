import { randomBytes } from "node:crypto";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { APIKeyDTO, CreateAPIKeyDTO, APIKeySchema, RestoreAPIKeyDTO } from "./apikey.dto";

export class APIKey extends Model<APIKeyDTO> {
    static create(props: CreateAPIKeyDTO): Either<ValidationError, APIKey> {
        const key = `api_${randomBytes(32).toString("hex")}`;
        const validDataOrError = ZodValidator.validate({ ...props, key }, APIKeySchema);
        if (!validDataOrError.success) return left(new ValidationError(APIKey.name, validDataOrError.errors));
        return right(new APIKey(validDataOrError.data));
    }

    static restore(props: RestoreAPIKeyDTO) {
        return new APIKey(props);
    }

    isValid(date = new Date()) {
        if (!this.props.active) return false;
        return this.props.expiresIn ? this.props.expiresIn >= date : true;
    }
}
