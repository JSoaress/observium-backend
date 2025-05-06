import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { z } from "@/infra/libs/zod";

import { LOG_LEVELS_VALUES } from "../log";

export const AlertRuleSchema = z.object({
    description: z.string().min(1),
    projectId: EntityIdSchema,
    condition: z.object({
        level: z.enum(LOG_LEVELS_VALUES),
        count: z.number({ coerce: true }).int().min(1),
        withinMinutes: z.number({ coerce: true }).int().min(1),
    }),
    action: z.object({
        type: z.enum(["email"]),
        to: z.array(z.string().email()),
    }),
    active: z.boolean({ coerce: true }).default(true),
});

type Schema = typeof AlertRuleSchema;

export type AlertRuleDTO = AbstractModelProps & z.output<Schema>;

export type RestoreAlertRuleDTO = RequireOnly<AlertRuleDTO, "id">;

export type CreateAlertRuleDTO = z.input<Schema>;
