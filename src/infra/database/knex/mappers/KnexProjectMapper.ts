import { IMapper } from "ts-arch-kit/dist/database";

import { Project } from "@/app/logs/domain/models/project";

import { DbFilterOptions } from "../../helpers";
import { KnexProjectDTO } from "../models";

export const KNEX_PROJECT_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        name: { columnName: "name", type: "string" },
        description: { columnName: "description", type: "string" },
        slug: { columnName: "slug", type: "string" },
        url: { columnName: "url", type: "string" },
        userId: { columnName: "user_id", type: "string" },
    },
} as const;

export class KnexProjectMapper implements IMapper<Project, KnexProjectDTO> {
    toDomain(persistence: KnexProjectDTO): Project {
        return Project.restore({
            id: persistence.id,
            name: persistence.name,
            description: persistence.description,
            slug: persistence.slug,
            url: persistence.url,
            userId: persistence.user_id,
        });
    }

    toPersistence(entity: Project): KnexProjectDTO {
        return {
            id: entity.getId(),
            name: entity.name,
            description: entity.description,
            slug: entity.slug,
            url: entity.url,
            user_id: entity.userId,
        };
    }
}
