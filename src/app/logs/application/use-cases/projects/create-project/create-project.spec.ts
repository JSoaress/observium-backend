import { beforeAll, describe, expect, test } from "vitest";

import { Project } from "@/app/logs/domain/models/project";
import { Password, User } from "@/app/users/domain/models/user";
import { RepositoryFactory } from "@/infra/database";

import { CreateProjectUseCaseInput } from "./types";
import { CreateProjectUseCase } from "./use-case";

let useCase: CreateProjectUseCase;
let requestUser: User;

beforeAll(async () => {
    const repositoryFactory = RepositoryFactory.getRepository("knex");
    useCase = new CreateProjectUseCase({ repositoryFactory });
    requestUser = User.restore({
        id: "01960396-cdd9-732c-856e-d5300c1f7d82",
        name: "John Doe",
        email: "johndoe@observium.com",
        password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
        active: true,
    });
});

describe("create project use case", () => {
    test("should save a new project", async () => {
        const input: CreateProjectUseCaseInput = {
            name: "My Projeect",
            description: "My personal project",
            slug: "my-project-2",
            url: "https://myproject.com",
            requestUser,
        };
        const response = await useCase.execute(input);
        expect(response.isRight()).toBeTruthy();
        expect(response.value).instanceOf(Project);
    });
});
