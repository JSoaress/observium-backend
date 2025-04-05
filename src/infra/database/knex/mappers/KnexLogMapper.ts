import { IMapper } from "ts-arch-kit/dist/database";

import { Log } from "@/app/logs/domain/models/log";

import { DbFilterOptions } from "../../helpers";
import { KnexLogDTO } from "../models";

export const KNEX_LOG_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        type: { columnName: "type", type: "string" },
        projectId: { columnName: "project_id", type: "string" },
        path: { columnName: "path", type: "string" },
        method: { columnName: "method", type: "string" },
        statusCode: { columnName: "status_code", type: "number" },
        statusText: { columnName: "status_text", type: "string" },
        duration: { columnName: "duration", type: "number" },
        context: { columnName: "context", type: "string" },
        response: { columnName: "response", type: "string" },
        error: { columnName: "error", type: "string" },
        createdAt: { columnName: "created_at", type: "date" },
    },
} as const;

export class KnexLogMapper implements IMapper<Log, KnexLogDTO> {
    toDomain(persistence: KnexLogDTO): Log {
        return Log.restore({
            id: persistence.id,
            type: persistence.type,
            projectId: persistence.project_id,
            path: persistence.path,
            method: persistence.method,
            statusCode: persistence.status_code,
            statusText: persistence.status_text,
            level: persistence.level,
            duration: persistence.duration,
            context: persistence.context,
            response: persistence.response,
            error: persistence.error,
            createdAt: persistence.created_at,
        });
    }

    toPersistence(entity: Log): KnexLogDTO {
        return {
            id: entity.getId(),
            type: entity.type,
            project_id: entity.projectId,
            path: entity.path,
            method: entity.method,
            status_code: entity.statusCode,
            status_text: entity.statusText,
            level: entity.level,
            duration: entity.duration,
            context: entity.context,
            response: entity.response,
            error: entity.error,
            created_at: entity.createdAt,
        };
    }
}
