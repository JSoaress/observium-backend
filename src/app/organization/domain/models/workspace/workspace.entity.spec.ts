import { beforeAll, describe, test, expect } from "vitest";

import { User, Password } from "@/app/users/domain/models/user";
import { UUID } from "@/shared/helpers";

import { WorkspaceMembershipDTO } from "./workspace-membership.dto";
import { CreateWorkspaceDTO } from "./workspace.dto";
import { Workspace } from "./workspace.entity";

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

describe("domain entity workspace", () => {
    test("should create a new workspace and add a new member", () => {
        const input: CreateWorkspaceDTO = {
            name: "My Workspace",
            owner: user,
        };
        const workspaceOrError = Workspace.create(input);
        expect(workspaceOrError.isRight()).toBeTruthy();
        const workspace = workspaceOrError.value as Workspace;
        expect(UUID.validate(workspace.getId())).toBeTruthy();
        expect(workspace.get("name")).toBe("My Workspace");
        expect(workspace.get("ownerId")).toBe("01960196-afee-76ca-b387-50018439238c");
        expect(workspace.getMembers().length).toBe(1);
    });

    test("should remove a member of the workspace", () => {
        const member: WorkspaceMembershipDTO = {
            id: "0198237d-5eb7-72b3-8942-d8a1188636fe",
            userId: "0198237e-3e1a-7d23-909f-286827135abe",
            workspaceId: "0198237d-29ba-7e8e-b625-0f85dbf2c405",
            role: "member",
        };
        const workspace = Workspace.restore({
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
                member,
            ],
        });
        const deleteMemberOrError = workspace.removeMember("0198237d-5eb7-72b3-8942-d8a1188636fe", user);
        expect(deleteMemberOrError.isRight()).toBeTruthy();
        expect(deleteMemberOrError.value).toBeUndefined();
        expect(workspace.getMembers().length).toBe(1);
    });
});
