import { beforeAll, describe, expect, test } from "vitest";

import { Password, User } from "@/app/users/domain/models/user";
import { RepositoryFactory } from "@/infra/database";
import { IWebSocket, SendMessageClientWebSocket } from "@/infra/socket";
import { UUID } from "@/shared/helpers";

import { RegisterLogUseCase } from "./RegisterLogUseCase";
import { RegisteredLog, RegisterLogUseCaseInput } from "./types";

let useCase: RegisterLogUseCase;
let requestUser: User;

beforeAll(() => {
    const repositoryFactory = RepositoryFactory.getRepository("knex");
    const webSocket: IWebSocket = new (class {
        send(message: SendMessageClientWebSocket): void {
            console.log("fake socket", message);
        }
        close(): void {
            // empty
        }
    })();
    useCase = new RegisterLogUseCase({ repositoryFactory, webSocket });
    requestUser = User.restore({
        id: "01960396-cdd9-732c-856e-d5300c1f7d82",
        name: "John Doe",
        email: "johndoe@observium.com",
        password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
        active: true,
    });
});

describe("register log use case", () => {
    test("should register a new log", async () => {
        const input: RegisterLogUseCaseInput = {
            type: "HTTP",
            path: "/api/users",
            method: "GET",
            statusCode: 200,
            level: "info",
            duration: 0.15,
            context: { query: { limit: 10 } },
            response: { users: [] },
            error: null,
            projectSlug: "my-project",
            requestUser,
        };
        const response = await useCase.execute(input);
        expect(response.isRight()).toBeTruthy();
        const output = response.value as RegisteredLog;
        expect(UUID.validate(output.logId)).toBeTruthy();
    });
});
