import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { User } from "./User";

export type UserTokenDTO = AbstractModelProps & {
    userId: string;
    token: string;
    type: "activation" | "reset-password";
    createdAt: Date;
};

export type CreateUserTokenDTO = {
    user: User;
};

export type RestoreUserToken = RequireOnly<UserTokenDTO, "id">;
