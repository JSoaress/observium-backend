import { QueryOptions } from "ts-arch-kit/dist/database";

import { IRepository } from "@/infra/database";

import { LogDTO, Log, LogSimplifiedDTO } from "../../domain/models/log";

export type LogRepositoryWhere = LogDTO;

export interface ILogRepository extends IRepository<Log, LogRepositoryWhere> {
    findSimplified(queryOptions?: QueryOptions): Promise<LogSimplifiedDTO[]>;
}
