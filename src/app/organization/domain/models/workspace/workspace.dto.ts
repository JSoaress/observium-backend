import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { z } from "@/infra/libs/zod";

import { CreateWorkspaceMembershipDTO, WorkspaceMembershipDTO } from "./workspace-membership.dto";

export const WorkspaceSchema = z.object({
    name: z.string({ coerce: true }).min(1).max(30),
    ownerId: EntityIdSchema,
});

type Schema = typeof WorkspaceSchema;

export type WorkspaceDTO = AbstractModelProps & z.output<Schema>;

export type CreateWorkspaceDTO = Omit<z.input<Schema>, "ownerId"> & { owner: User };

export type RestoreWorkspaceDTO = RequireOnly<WorkspaceDTO, "id"> & { members: WorkspaceMembershipDTO[] };

export type AddMembershipInWorkspace = Omit<CreateWorkspaceMembershipDTO, "workspaceId">;
