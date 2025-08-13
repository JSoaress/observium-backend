import { LogLevels, LogType } from "@/app/logs/domain/models/log";
import { WorkspaceMembershipRoles } from "@/app/organization/domain/models/workspace";

export type KnexModel = { id: string };

export type KnexUserDTO = KnexModel & {
    name: string;
    email: string;
    password: string;
    is_active: boolean;
};

export type KnexUserTokenDTO = KnexModel & {
    user_id: string;
    token: string;
    type: "activation" | "reset-password";
    created_at: Date;
};

export type KnexAPIKeyDTO = KnexModel & {
    alias: string;
    key: string;
    project_id: string;
    expires_in: Date | null;
    active: boolean;
};

export type KnexProjectDTO = KnexModel & {
    name: string;
    description: string | null;
    slug: string;
    url: string | null;
    workspace_id: string;
};

export type KnexLogDTO = KnexModel & {
    type: LogType;
    project_id: string;
    external_id: string | null;
    level: LogLevels;
    message: string;
    duration: number;
    context: Record<string, unknown> | null;
    error: Record<string, unknown> | null;
    stack: string | null;
    tags: string | null;
    created_at: Date;
};

export type KnexWorkspaceDTO = KnexModel & {
    name: string;
    owner_id: string;
    members: (KnexModel & {
        user_id: string;
        workspace_id: string;
        role: WorkspaceMembershipRoles;
    })[];
};
