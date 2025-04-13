import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { z } from "@/infra/libs/zod";

const LOG_TYPES_VALUES = ["HTTP", "SERVER-ACTION", "OTHER"] as const;

export type LogType = (typeof LOG_TYPES_VALUES)[number];

// const HTTP_METHODS_VALUES = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

// export type LogHttpMethods = (typeof HTTP_METHODS_VALUES)[number];

// const SERVER_ACTION_METHODS_VALUES = ["CREATE", "READ", "UPDATE", "DELETE"] as const;

const LOG_LEVELS_VALUES = ["silly", "debug", "info", "warn", "error", "critical"] as const;

export type LogLevels = (typeof LOG_LEVELS_VALUES)[number];

export const LogSchema = z
    .object({
        type: z.enum(LOG_TYPES_VALUES),
        projectId: EntityIdSchema,
        path: z.string({ coerce: true }).min(1),
        method: z.string({ coerce: true }).toUpperCase(),
        externalId: z.string({ coerce: true }).nullish().default(null),
        statusCode: z.number({ coerce: true }).int().nonnegative().default(0),
        statusText: z.string({ coerce: true }).nullish().default(null),
        level: z.enum(LOG_LEVELS_VALUES),
        duration: z.number({ coerce: true }).nonnegative().default(0),
        context: z.record(z.any()).nullish().default(null),
        response: z.record(z.any()).nullish().default(null),
        error: z.record(z.any()).nullish().default(null),
        createdAt: z.date(),
    })
    .refine((data) => data.type === "OTHER" || data.method.length, {
        message: "Esse campo não pode ficar vazio quando o type é HTTP ou SERVER-ACTION.",
        path: ["method"],
    });

type Schema = typeof LogSchema;

export type LogDTO = AbstractModelProps & z.output<Schema>;

export type CreateLogDTO = Omit<z.input<Schema>, "createdAt">;

export type RestoreLogDTO = RequireOnly<LogDTO, "id">;

export type LogSimplifiedDTO = Omit<LogDTO, "context" | "response" | "error">;

export type TotalDailyLogs = Record<LogLevels, number> & {
    date: Date;
    logs: number;
};
