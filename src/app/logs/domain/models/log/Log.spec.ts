import { describe, expect, test } from "vitest";

import { UUID } from "@/shared/helpers";

import { Log } from "./Log";
import { CreateLogDTO } from "./LogDTO";

describe("domain entity log", () => {
    test("should create a log of type http", () => {
        const input: CreateLogDTO = {
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            level: "info",
            message: "Get users",
            context: {
                type: "http",
                method: "GET",
                url: "http://localhost:8080/users",
                status: 200,
                duration: 80,
            },
            externalId: "get-users-00987",
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("http");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.level).toBe("info");
        expect(log.message).toBe("Get users");
        expect(log.context.method).toBe("GET");
        expect(log.context.url).toBe("http://localhost:8080/users");
        expect(log.context.status).toBe(200);
        expect(log.duration).toBe(80);
        expect(log.externalId).toBe("get-users-00987");
        expect(log.error).toBeNull();
        expect(log.stack).toBeNull();
    });

    test("should create a log of type function", () => {
        const input: CreateLogDTO = {
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            level: "debug",
            message: "Sum two numbers",
            context: {
                type: "function",
                functionName: "sumValues",
                args: { a: 10, b: 7 },
                duration: 1,
                result: 17,
            },
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("function");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.level).toBe("debug");
        expect(log.message).toBe("Sum two numbers");
        expect(log.context.functionName).toBe("sumValues");
        expect(log.context.args).toEqual({ a: 10, b: 7 });
        expect(log.context.result).toEqual(17);
        expect(log.duration).toBe(1);
        expect(log.externalId).toBeNull();
        expect(log.error).toBeNull();
        expect(log.stack).toBeNull();
    });

    test("should create a log of type sql", () => {
        const input: CreateLogDTO = {
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            level: "notice",
            message: "fetch all customers",
            context: {
                type: "sql",
                query: "select * from customers",
                duration: 1200,
            },
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("sql");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.level).toBe("notice");
        expect(log.message).toBe("fetch all customers");
        expect(log.context.query).toBe("select * from customers");
        expect(log.context.params).toBeNull();
        expect(log.duration).toBe(1200);
        expect(log.externalId).toBeNull();
        expect(log.error).toBeNull();
        expect(log.stack).toBeNull();
    });

    test("should create a log of type queue", () => {
        const input: CreateLogDTO = {
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            level: "warning",
            message: "processing payments",
            context: {
                type: "queue",
                queue: "process-payment",
                jobId: 123458796,
                status: "failed",
                duration: 120,
            },
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("queue");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.level).toBe("warning");
        expect(log.message).toBe("processing payments");
        expect(log.context.queue).toBe("process-payment");
        expect(log.context.jobId).toBe(123458796);
        expect(log.context.status).toBe("failed");
        expect(log.duration).toBe(120);
        expect(log.externalId).toBeNull();
        expect(log.error).toBeNull();
        expect(log.stack).toBeNull();
    });

    test("should create a log of type other", () => {
        const input: CreateLogDTO = {
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            level: "error",
            message: "failed to send notification",
            context: {
                type: "other",
                data: { message: "you have a new email" },
            },
            error: { message: "Comunication error" },
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("other");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.level).toBe("error");
        expect(log.message).toBe("failed to send notification");
        expect(log.context.data).toEqual({ message: "you have a new email" });
        expect(log.duration).toBe(0);
        expect(log.externalId).toBeNull();
        expect(log.error).toEqual({ message: "Comunication error" });
        expect(log.stack).toBeNull();
    });
});
