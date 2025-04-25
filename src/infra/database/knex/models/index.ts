import { LogLevels, LogType } from "@/app/logs/domain/models/log";

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
    user_id: string;
    expires_in: Date | null;
    active: boolean;
};

export type KnexProjectDTO = KnexModel & {
    name: string;
    description: string | null;
    slug: string;
    url: string | null;
    user_id: string;
};

export type KnexLogDTO = KnexModel & {
    type: LogType;
    project_id: string;
    external_id: string | null;
    level: LogLevels;
    message: string;
    duration: number;
    context: string | null;
    error: string | null;
    stack: string | null;
    tags: string | null;
    created_at: Date;
};
