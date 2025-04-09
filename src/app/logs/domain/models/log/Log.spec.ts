import { describe, expect, test } from "vitest";

import { UUID } from "@/shared/helpers";

import { Log } from "./Log";
import { CreateLogDTO } from "./LogDTO";

describe("domain entity log", () => {
    test("should create a log of type API", () => {
        const input: CreateLogDTO = {
            type: "HTTP",
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            path: "/api/users",
            method: "GET",
            statusCode: 200,
            level: "info",
            duration: 0.15,
            context: { query: { limit: 10 } },
            response: { users: [] },
            error: null,
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("HTTP");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.path).toBe("/api/users");
        expect(log.method).toBe("GET");
        expect(log.level).toBe("info");
        expect(log.statusCode).toBe(200);
        expect(log.statusText).toBeNull();
        expect(log.duration).toBe(0.15);
        expect(log.context).toEqual({ query: { limit: 10 } });
        expect(log.response).toEqual({ users: [] });
        expect(log.error).toBeNull();
    });

    test("should create a log of type SERVER-ACTION", () => {
        const input: CreateLogDTO = {
            type: "SERVER-ACTION",
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            path: "create user",
            method: "CREATE",
            statusText: "success",
            level: "silly",
            duration: 0.25,
            context: { userEmail: "user@example.com" },
            response: { userId: "123" },
            error: null,
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("SERVER-ACTION");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.path).toBe("create user");
        expect(log.method).toBe("CREATE");
        expect(log.statusCode).toBe(0);
        expect(log.statusText).toBe("success");
        expect(log.externalId).toBeNull();
        expect(log.level).toBe("silly");
        expect(log.duration).toBe(0.25);
        expect(log.context).toEqual({ userEmail: "user@example.com" });
        expect(log.response).toEqual({ userId: "123" });
        expect(log.error).toBeNull();
    });

    test("should create a log of type OTHER", () => {
        const input: CreateLogDTO = {
            type: "OTHER",
            projectId: "0195fea2-33f6-7bb8-858a-577665de1472",
            path: "user registration",
            method: "",
            externalId: "external-id",
            level: "error",
            duration: 0.37,
            context: { source: "signup form" },
            response: null,
            error: { message: "form.user is undefined" },
        };
        const logOrError = Log.create(input);
        expect(logOrError.isRight()).toBeTruthy();
        const log = logOrError.value as Log;
        expect(UUID.validate(log.getId())).toBeTruthy();
        expect(log.type).toBe("OTHER");
        expect(log.projectId).toBe("0195fea2-33f6-7bb8-858a-577665de1472");
        expect(log.path).toBe("user registration");
        expect(log.method).toBe("");
        expect(log.statusCode).toBe(0);
        expect(log.statusText).toBeNull();
        expect(log.externalId).toBe("external-id");
        expect(log.level).toBe("error");
        expect(log.duration).toBe(0.37);
        expect(log.context).toEqual({ source: "signup form" });
        expect(log.response).toBeNull();
        expect(log.error).toEqual({ message: "form.user is undefined" });
    });
});
