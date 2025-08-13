import { IMapper } from "ts-arch-kit/dist/database";

import { APIKey } from "@/app/projects/domain/models/api-key";

import { DbFilterOptions } from "../../helpers";
import { KnexAPIKeyDTO } from "../models";

export const KNEX_API_KEY_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        alias: { columnName: "name", type: "string" },
        key: { columnName: "key", type: "string" },
        projectId: { columnName: "project_id", type: "string" },
        expiresIn: { columnName: "expires_in", type: "date" },
        active: { columnName: "active", type: "boolean" },
    },
} as const;

export class KnexAPIKeyMapper implements IMapper<APIKey, KnexAPIKeyDTO> {
    toDomain(persistence: KnexAPIKeyDTO): APIKey {
        return APIKey.restore({
            id: persistence.id,
            alias: persistence.alias,
            key: persistence.key,
            projectId: persistence.project_id,
            expiresIn: persistence.expires_in,
            active: persistence.active,
        });
    }

    toPersistence(entity: APIKey): KnexAPIKeyDTO {
        return {
            id: entity.getId(),
            alias: entity.get("alias"),
            key: entity.get("key"),
            project_id: entity.get("projectId"),
            expires_in: entity.get("expiresIn"),
            active: entity.get("active"),
        };
    }
}
