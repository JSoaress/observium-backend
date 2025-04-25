import { IMapper } from "ts-arch-kit/dist/database";

import { Log } from "@/app/logs/domain/models/log";

import { DbFilterOptions } from "../../helpers";
import { KnexLogDTO } from "../models";

export const KNEX_LOG_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        type: { columnName: "type", type: "string" },
        projectId: { columnName: "project_id", type: "string" },
        externalId: { columnName: "external_id", type: "string" },
        level: { columnName: "level", type: "string" },
        message: { columnName: "message", type: "string" },
        duration: { columnName: "duration", type: "number" },
        context: { columnName: "context", type: "string" },
        error: { columnName: "error", type: "string" },
        stack: { columnName: "stack", type: "string" },
        tags: { columnName: "tags", type: "string" },
        createdAt: { columnName: "created_at", type: "date" },
    },
} as const;

export class KnexLogMapper implements IMapper<Log, KnexLogDTO> {
    toDomain(persistence: KnexLogDTO): Log {
        return Log.restore({
            id: persistence.id,
            projectId: persistence.project_id,
            externalId: persistence.external_id,
            level: persistence.level,
            message: persistence.message,
            context: persistence.context ? JSON.parse(persistence.context) : null,
            error: persistence.error ? JSON.parse(persistence.error) : null,
            stack: persistence.stack ? JSON.parse(persistence.stack) : null,
            tags: persistence.tags ? persistence.tags.split(",") : [],
            createdAt: persistence.created_at,
        });
    }

    toPersistence(entity: Log): KnexLogDTO {
        return {
            id: entity.getId(),
            type: entity.type,
            project_id: entity.projectId,
            external_id: entity.externalId,
            level: entity.level,
            message: entity.message,
            duration: entity.duration,
            context: entity.context ? JSON.stringify(entity.context) : null,
            error: entity.error ? JSON.stringify(entity.error) : null,
            stack: entity.stack ? JSON.stringify(entity.stack) : null,
            tags: entity.tags.length ? entity.tags.join() : null,
            created_at: entity.createdAt,
        };
    }
}
