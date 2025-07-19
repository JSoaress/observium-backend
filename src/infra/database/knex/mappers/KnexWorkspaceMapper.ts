import { IMapper } from "ts-arch-kit/dist/database";

import { Workspace } from "@/app/organization/domain/models/workspace";

import { DbFilterOptions } from "../../helpers";
import { KnexWorkspaceDTO } from "../models";

export const KNEX_WORKSPACE_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        name: { columnName: "name", type: "string" },
        ownerId: { columnName: "owner_id", type: "string" },
    },
} as const;

export class KnexWorkspaceMapper implements IMapper<Workspace, KnexWorkspaceDTO> {
    toDomain(persistence: KnexWorkspaceDTO): Workspace {
        return Workspace.restore({
            id: persistence.id,
            name: persistence.name,
            ownerId: persistence.owner_id,
            members: persistence.members.map((m) => ({
                id: m.id,
                userId: m.user_id,
                workspaceId: m.workspace_id,
                role: m.role,
            })),
        });
    }

    toPersistence(entity: Workspace): KnexWorkspaceDTO {
        return {
            id: entity.getId(),
            name: entity.get("name"),
            owner_id: entity.get("ownerId"),
            members: entity.getMembers().map((m) => ({
                id: m.id as string,
                user_id: m.userId,
                workspace_id: m.workspaceId,
                role: m.role,
            })),
        };
    }
}
