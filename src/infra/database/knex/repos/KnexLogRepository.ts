import { QueryOptions } from "ts-arch-kit/dist/database";

import { ILogRepository } from "@/app/logs/application/repos";
import { Log, LogSimplifiedDTO } from "@/app/logs/domain/models/log";

import { KNEX_LOG_FILTER, KnexLogMapper } from "../mappers";
import { KnexLogDTO } from "../models";
import { DefaultKnexRepository } from "./DefaultKnexRepository";

export class KnexLogRepository extends DefaultKnexRepository<Log, KnexLogDTO> implements ILogRepository {
    constructor() {
        super("logs", new KnexLogMapper(), KNEX_LOG_FILTER);
    }

    findSimplified(queryOptions?: QueryOptions): Promise<LogSimplifiedDTO[]> {
        throw new Error("Method not implemented.");
    }
}
