import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

import { Password } from "./Password";

export const UserSchema = z.object({
    name: z.string({ coerce: true }).max(30),
    email: z.string().email(),
    active: z.boolean({ coerce: true }).default(false),
});

type Schema = typeof UserSchema;

export type UserDTO = AbstractModelProps &
    z.output<Schema> & {
        password: Password;
    };

export type CreateUserDTO = z.input<Schema> & {
    password: string;
};

export type RestoreUserDTO = RequireOnly<UserDTO, "id">;
