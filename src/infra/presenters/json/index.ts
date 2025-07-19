/* eslint-disable max-classes-per-file */
import { IPresenter } from "ts-arch-kit/dist/core/helpers";

import { Log, LogDTO } from "@/app/logs/domain/models/log";
import { Project, ProjectDTO } from "@/app/logs/domain/models/project";
import { Workspace, WorkspaceDTO, WorkspaceMembershipDTO } from "@/app/organization/domain/models/workspace";
import { APIKey, APIKeyDTO } from "@/app/users/domain/models/api-key";
import { User, UserDTO } from "@/app/users/domain/models/user";

type UserJson = Omit<UserDTO, "password">;

export class UserJsonPresenter implements IPresenter<User, UserJson> {
    present(input: User): UserJson {
        return {
            id: input.getId(),
            name: input.name,
            email: input.email,
            active: input.active,
        };
    }
}

type ProjectJson = ProjectDTO;

export class ProjectJsonPresenter implements IPresenter<Project, ProjectJson> {
    present(input: Project): ProjectJson {
        return {
            id: input.getId(),
            name: input.name,
            description: input.description,
            slug: input.slug,
            url: input.url,
            userId: input.userId,
        };
    }
}

type APIKeyJson = APIKeyDTO;

export class APIKeyJsonPresenter implements IPresenter<APIKey, APIKeyJson> {
    present(input: APIKey): APIKeyJson {
        return {
            id: input.getId(),
            alias: input.alias,
            key: input.key,
            userId: input.userId,
            expiresIn: input.expiresIn,
            active: input.active,
        };
    }
}

type LogJson = LogDTO;

export class LogJsonPresenter implements IPresenter<Log, LogJson> {
    present(input: Log): LogJson {
        return {
            id: input.getId(),
            type: input.type,
            projectId: input.projectId,
            externalId: input.externalId,
            level: input.level,
            message: input.message,
            duration: input.duration,
            context: input.context,
            error: input.error,
            stack: input.stack,
            tags: input.tags,
            createdAt: input.createdAt,
        };
    }
}

type WorkspaceJson = WorkspaceDTO & { members: WorkspaceMembershipDTO[] };

export class WorkspaceJsonPresenter implements IPresenter<Workspace, WorkspaceJson> {
    present(input: Workspace): WorkspaceJson {
        return {
            id: input.getId(),
            name: input.get("name"),
            ownerId: input.get("ownerId"),
            members: input.getMembers(),
        };
    }
}
