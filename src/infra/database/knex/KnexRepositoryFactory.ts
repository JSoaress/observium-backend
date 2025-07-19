import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IProjectRepository, ILogRepository, IAlertRuleRepository } from "@/app/logs/application/repos";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { IUserRepository, IUserTokenRepository, IAPIKeyRepository } from "@/app/users/application/repos";

import { IRepositoryFactory } from "../IRepositoryFactory";
import { KnexUnitOfWork } from "./KnexUnitOfWork";
import * as mappers from "./mappers";
import * as repos from "./repos";

export class KnexRepositoryFactory implements IRepositoryFactory {
    createUnitOfWork(): UnitOfWork {
        return new KnexUnitOfWork();
    }

    createUserRepository(): IUserRepository {
        return new repos.DefaultKnexRepository("users", new mappers.KnexUserMapper(), mappers.KNEX_USER_FILTER);
    }

    createUserTokenRepository(): IUserTokenRepository {
        return new repos.DefaultKnexRepository(
            "user_tokens",
            new mappers.KnexUserTokenMapper(),
            mappers.KNEX_USER_TOKEN_FILTER
        );
    }

    createAPIKeyRepository(): IAPIKeyRepository {
        return new repos.DefaultKnexRepository("api_keys", new mappers.KnexAPIKeyMapper(), mappers.KNEX_API_KEY_FILTER);
    }

    createProjectRepository(): IProjectRepository {
        return new repos.DefaultKnexRepository("projects", new mappers.KnexProjectMapper(), mappers.KNEX_PROJECT_FILTER);
    }

    createLogRepository(): ILogRepository {
        return new repos.KnexLogRepository();
    }

    createAlertRuleRepository(): IAlertRuleRepository {
        throw new Error("Method not implemented.");
    }

    createWorkspaceRepository(): IWorkspaceRepository {
        return new repos.KnexWorkspaceRepository();
    }
}
