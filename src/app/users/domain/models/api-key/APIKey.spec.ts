import { beforeAll, describe, expect, test } from "vitest";

import { Password, User } from "@/app/users/domain/models/user";
import { UUID } from "@/shared/helpers";

import { APIKey } from "./APIKey";
import { CreateAPIKeyDTO } from "./APIKeyDTO";

let user: User;

beforeAll(() => {
    user = User.restore({
        id: "01960196-afee-76ca-b387-50018439238c",
        name: "John Doe",
        email: "johndoe@observium.com",
        password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
        active: true,
    });
});

describe("domain entity project", () => {
    test("should create a new project", () => {
        const input: CreateAPIKeyDTO = {
            alias: "API key of my project",
            key: "my-api-key",
            expiresIn: new Date("2025-31-12"),
            userId: user.getId(),
        };
        const apiKeyOrError = APIKey.create(input);
        expect(apiKeyOrError.isRight()).toBeTruthy();
        const apiKey = apiKeyOrError.value as APIKey;
        expect(UUID.validate(apiKey.getId())).toBeTruthy();
        expect(apiKey.alias).toBe("API key of my project");
        expect(apiKey.key).toBe("my-api-key");
        expect(apiKey.userId).toBe("01960196-afee-76ca-b387-50018439238c");
        expect(apiKey.expiresIn).instanceOf(Date);
        expect(apiKey.active).toBeTruthy();
    });
});
