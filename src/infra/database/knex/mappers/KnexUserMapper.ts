import { IMapper } from "ts-arch-kit/dist/database";

import { Password, User } from "@/app/users/domain/models/user";

import { DbFilterOptions } from "../../helpers";
import { KnexUserDTO } from "../models";

export const KNEX_USER_FILTER: DbFilterOptions = {
    columns: {
        id: { columnName: "id", type: "string" },
        name: { columnName: "name", type: "string" },
        email: { columnName: "email", type: "string" },
        password: { columnName: "password", type: "string", blockFilter: true },
        active: { columnName: "is_active", type: "boolean" },
    },
} as const;

export class KnexUserMapper implements IMapper<User, KnexUserDTO> {
    toDomain(persistence: KnexUserDTO): User {
        return User.restore({
            id: persistence.id,
            name: persistence.name,
            email: persistence.email,
            password: Password.restore(persistence.password),
            active: persistence.is_active,
        });
    }

    toPersistence(entity: User): KnexUserDTO {
        return {
            id: entity.getId(),
            name: entity.name,
            email: entity.email,
            password: entity.password,
            is_active: entity.active,
        };
    }
}
