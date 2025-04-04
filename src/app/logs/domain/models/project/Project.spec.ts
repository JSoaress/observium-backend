import { beforeAll, describe, expect, test } from "vitest";

import { Password, User } from "@/app/users/domain/models/user";
import { UUID } from "@/shared/helpers";

import { Project } from "./Project";
import { CreateProjectDTO } from "./ProjectDTO";

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
        const input: CreateProjectDTO = {
            name: "My Projeect",
            description: "My personal project",
            slug: "my-project",
            url: "https://myproject.com",
            userId: user.getId(),
        };
        const projectOrError = Project.create(input);
        expect(projectOrError.isRight()).toBeTruthy();
        const project = projectOrError.value as Project;
        expect(UUID.validate(project.getId())).toBeTruthy();
        expect(project.name).toBe("My Projeect");
        expect(project.description).toBe("My personal project");
        expect(project.slug).toBe("my-project");
        expect(project.url).toBe("https://myproject.com");
        expect(project.userId).toBe("01960196-afee-76ca-b387-50018439238c");
    });
});
