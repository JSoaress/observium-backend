import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { z } from "@/infra/libs/zod";

export const ProjectSchema = z.object({
    name: z.string({ coerce: true }).min(1).max(30),
    description: z.string({ coerce: true }).nullish().default(null),
    slug: z
        .string({ coerce: true })
        .min(1)
        .max(30)
        .regex(/^[a-zA-Z0-9-]+$/, "Informe apenas letras, dígitos e '-'."),
    url: z.string({ coerce: true }).url().nullish().default(null),
    userId: EntityIdSchema,
});

type Schema = typeof ProjectSchema;

export type ProjectDTO = AbstractModelProps & z.output<Schema>;

export type CreateProjectDTO = z.input<Schema>;

export type RestoreProjectDTO = RequireOnly<ProjectDTO, "id">;
