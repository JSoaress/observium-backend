import { randomUUID } from "node:crypto";
import { Either, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { UnknownError } from "@/app/_common/errors";

import { CreateUserTokenDTO, UserTokenDTO } from "./UserTokenDTO";

export class UserToken extends Model<UserTokenDTO> {
    private constructor(props: UserTokenDTO) {
        super(props);
    }

    static createActivation(props: CreateUserTokenDTO): Either<UnknownError, UserToken> {
        const data: UserTokenDTO = {
            userId: props.user.getId(),
            token: randomUUID(),
            type: "activation",
            createdAt: new Date(),
        };
        return right(new UserToken(data));
    }

    static createResetPassword(props: CreateUserTokenDTO): Either<UnknownError, UserToken> {
        const data: UserTokenDTO = {
            userId: props.user.getId(),
            token: randomUUID(),
            type: "reset-password",
            createdAt: new Date(),
        };
        return right(new UserToken(data));
    }

    get userId() {
        return this.props.userId;
    }

    get token() {
        return this.props.token;
    }

    get type() {
        return this.props.type;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    isActivation() {
        return this.props.type === "activation";
    }

    isResetPassword() {
        return this.props.type === "reset-password";
    }
}
