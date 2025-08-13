import { IRepository } from "@/infra/database";

import { APIKey, APIKeyDTO } from "../../domain/models/api-key";

export type APIKeyRepositoryWhere = APIKeyDTO;

export type IAPIKeyRepository = IRepository<APIKey, APIKeyRepositoryWhere>;
