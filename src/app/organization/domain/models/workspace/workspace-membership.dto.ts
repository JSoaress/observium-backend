import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { EntityIdSchema } from "@/app/_common";
import { z } from "@/infra/libs/zod";

const WORKSPACE_MEMBERSHIP_ROLES_VALUES = ["admin", "member", "viewer"] as const;

export type WorkspaceMembershipRoles = (typeof WORKSPACE_MEMBERSHIP_ROLES_VALUES)[number];

export const WorkspaceMembershipSchema = z.object({
    userId: EntityIdSchema,
    workspaceId: EntityIdSchema,
    role: z.enum(WORKSPACE_MEMBERSHIP_ROLES_VALUES),
});

type Schema = typeof WorkspaceMembershipSchema;

export type WorkspaceMembershipDTO = AbstractModelProps & z.output<Schema>;

export type CreateWorkspaceMembershipDTO = z.input<Schema>;

export type RestoreWorkspaceMembershipDTO = RequireOnly<WorkspaceMembershipDTO, "id">;
