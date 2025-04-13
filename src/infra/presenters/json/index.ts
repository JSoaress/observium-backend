/* eslint-disable max-classes-per-file */
import { IPresenter } from "ts-arch-kit/dist/core/helpers";

import { Log, LogDTO, LogSimplifiedDTO } from "@/app/logs/domain/models/log";
import { Project, ProjectDTO } from "@/app/logs/domain/models/project";
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
            path: input.path,
            method: input.method,
            externalId: input.externalId,
            statusCode: input.statusCode,
            statusText: input.statusText,
            level: input.level,
            duration: input.duration,
            context: input.context,
            response: input.response,
            error: input.error,
            createdAt: input.createdAt,
        };
    }
}

export type LogSimplifiedJson = LogSimplifiedDTO;

export class LogSimplifiedJsonPresenter implements IPresenter<LogSimplifiedDTO, LogSimplifiedJson> {
    present(input: LogSimplifiedDTO): LogSimplifiedJson {
        return {
            id: input.id,
            type: input.type,
            projectId: input.projectId,
            path: input.path,
            method: input.method,
            externalId: input.externalId,
            statusCode: input.statusCode,
            statusText: input.statusText,
            level: input.level,
            duration: input.duration,
            createdAt: input.createdAt,
        };
    }
}
