import { beforeAll, describe, expect, test } from "vitest";

import { Workspace } from "@/app/organization/domain/models/workspace";
import { UUID } from "@/shared/helpers";

import { CreateProjectDTO } from "./project.dto";
import { Project } from "./project.entity";

let workspace: Workspace;

beforeAll(() => {
    workspace = Workspace.restore({
        id: "0198237d-29ba-7e8e-b625-0f85dbf2c405",
        name: "My Workspace",
        ownerId: "01960196-afee-76ca-b387-50018439238c",
        members: [
            {
                id: "01982380-a3c2-70e8-a428-57deba437f2c",
                userId: "01960196-afee-76ca-b387-50018439238c",
                workspaceId: "0198237d-29ba-7e8e-b625-0f85dbf2c405",
                role: "admin",
            },
        ],
    });
});

describe("domain entity project", () => {
    test("should create a new project", () => {
        const input: CreateProjectDTO = {
            name: "My Projeect",
            description: "My personal project",
            slug: "my-project",
            url: "https://myproject.com",
            workspaceId: workspace.getId(),
        };
        const projectOrError = Project.create(input);
        expect(projectOrError.isRight()).toBeTruthy();
        const project = projectOrError.value as Project;
        expect(UUID.validate(project.getId())).toBeTruthy();
        expect(project.get("name")).toBe("My Projeect");
        expect(project.get("description")).toBe("My personal project");
        expect(project.get("slug")).toBe("my-project");
        expect(project.get("url")).toBe("https://myproject.com");
        expect(project.get("workspaceId")).toBe("0198237d-29ba-7e8e-b625-0f85dbf2c405");
    });
});
