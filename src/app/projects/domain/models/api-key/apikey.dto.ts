import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { z } from "@/infra/libs/zod";

export const APIKeySchema = z.object({
    alias: z.string({ coerce: true }).min(1).max(30),
    key: z.string({ coerce: true }).min(1),
    projectId: EntityIdSchema,
    expiresIn: z.date({ coerce: true }).nullish().default(null),
    active: z.boolean({ coerce: true }).default(true),
});

type Schema = typeof APIKeySchema;

export type APIKeyDTO = AbstractModelProps & z.output<Schema>;

export type CreateAPIKeyDTO = Omit<z.input<Schema>, "key">;

export type RestoreAPIKeyDTO = RequireOnly<APIKeyDTO, "id">;
