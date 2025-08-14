import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { z } from "@/infra/libs/zod";

const LOG_TYPES_VALUES = ["http", "function", "sql", "queue", "other"] as const;

export type LogType = (typeof LOG_TYPES_VALUES)[number];

export const LOG_LEVELS_VALUES = ["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"] as const;

export type LogLevels = (typeof LOG_LEVELS_VALUES)[number];

const HTTP_METHODS_VALUES = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;

export type LogHttpMethods = (typeof HTTP_METHODS_VALUES)[number];

const LogContextSchema = z.discriminatedUnion("type", [
    z
        .object({
            type: z.literal(LOG_TYPES_VALUES[0]),
            method: z.preprocess((arg) => `${arg}`.toUpperCase(), z.enum(HTTP_METHODS_VALUES)),
            url: z.string({ coerce: true }).min(1),
            status: z.number({ coerce: true }).int().nonnegative().default(0),
            duration: z.number({ coerce: true }).nonnegative().default(0),
        })
        .passthrough(),
    z
        .object({
            type: z.literal(LOG_TYPES_VALUES[1]),
            functionName: z.string({ coerce: true }).min(1),
            args: z.record(z.any()).nullish().default(null),
            duration: z.number({ coerce: true }).nonnegative().default(0),
            result: z.any(),
        })
        .passthrough(),
    z
        .object({
            type: z.literal(LOG_TYPES_VALUES[2]),
            query: z.string({ coerce: true }).min(1),
            params: z.record(z.any()).nullish().default(null),
            duration: z.number({ coerce: true }).nonnegative().default(0),
        })
        .passthrough(),
    z
        .object({
            type: z.literal(LOG_TYPES_VALUES[3]),
            queue: z.string({ coerce: true }).min(1),
            jobId: z.number({ coerce: true }).int().nonnegative().default(0),
            status: z.string({ coerce: true }).nullish().default(null),
            duration: z.number({ coerce: true }).nonnegative().default(0),
        })
        .passthrough(),
    z
        .object({
            type: z.literal(LOG_TYPES_VALUES[4]),
        })
        .passthrough(),
]);

export const LogSchema = z.object({
    projectId: EntityIdSchema,
    externalId: z.string({ coerce: true }).nullish().default(null),
    level: z.enum(LOG_LEVELS_VALUES),
    message: z.string({ coerce: true }).min(1),
    context: LogContextSchema,
    error: z.record(z.any()).nullish().default(null),
    stack: z.string({ coerce: true }).nullish().default(null),
    tags: z.array(z.string({ coerce: true })).default([]),
    createdAt: z.date(),
});

type Schema = typeof LogSchema;

export type LogDTO = AbstractModelProps & z.output<Schema> & { type: LogType; duration: number };

export type CreateLogDTO = Omit<z.input<Schema>, "createdAt">;

export type RestoreLogDTO = Omit<RequireOnly<LogDTO, "id">, "type" | "duration">;

export type LogSimplifiedDTO = Pick<LogDTO, "type" | "duration"> & Omit<LogDTO, "context" | "error" | "stack">;

export type TotalDailyLogs = Record<LogLevels, number> & {
    date: Date;
    logs: number;
};
