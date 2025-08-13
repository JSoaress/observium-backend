import { beforeAll, describe, expect, test } from "vitest";

import { UUID } from "@/shared/helpers";

import { Project } from "../project";
import { CreateAPIKeyDTO } from "./apikey.dto";
import { APIKey } from "./apikey.entity";

let project: Project;

beforeAll(() => {
    project = Project.restore({
        id: "01960196-afee-76ca-b387-50018439238c",
        name: "My Projeect",
        description: "My personal project",
        slug: "my-project",
        url: "https://myproject.com",
        workspaceId: "0198237d-29ba-7e8e-b625-0f85dbf2c405",
    });
});

describe("domain entity project", () => {
    test("should create a new project", () => {
        const input: CreateAPIKeyDTO = {
            alias: "API key of my project",
            expiresIn: new Date("2025-31-12"),
            projectId: project.getId(),
        };
        const apiKeyOrError = APIKey.create(input);
        expect(apiKeyOrError.isRight()).toBeTruthy();
        const apiKey = apiKeyOrError.value as APIKey;
        expect(UUID.validate(apiKey.getId())).toBeTruthy();
        expect(apiKey.get("alias")).toBe("API key of my project");
        expect(apiKey.get("key")).toBeDefined();
        expect(apiKey.get("key").startsWith("api_")).toBeTruthy();
        expect(apiKey.get("projectId")).toBe("01960196-afee-76ca-b387-50018439238c");
        expect(apiKey.get("expiresIn")).instanceOf(Date);
        expect(apiKey.get("active")).toBeTruthy();
    });
});
