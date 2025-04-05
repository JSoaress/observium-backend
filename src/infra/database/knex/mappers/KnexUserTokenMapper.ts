import { IMapper } from "ts-arch-kit/dist/database";

import { UserToken } from "@/app/users/domain/models/user";

import { DbFilterOptions } from "../../helpers";
import { KnexUserTokenDTO } from "../models";

export const KNEX_USER_TOKEN_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        userId: { columnName: "user_id", type: "string" },
        token: { columnName: "token", type: "string" },
        type: { columnName: "type", type: "string" },
        createdAt: { columnName: "created_at", type: "date" },
    },
} as const;

export class KnexUserTokenMapper implements IMapper<UserToken, KnexUserTokenDTO> {
    toDomain(persistence: KnexUserTokenDTO): UserToken {
        return UserToken.restore({
            id: persistence.id,
            userId: persistence.user_id,
            token: persistence.token,
            type: persistence.type,
            createdAt: persistence.created_at,
        });
    }

    toPersistence(entity: UserToken): KnexUserTokenDTO {
        return {
            id: entity.getId(),
            user_id: entity.userId,
            token: entity.token,
            type: entity.type,
            created_at: entity.createdAt,
        };
    }
}
