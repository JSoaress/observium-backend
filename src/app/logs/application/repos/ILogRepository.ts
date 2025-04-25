import { QueryOptions } from "ts-arch-kit/dist/database";

import { IRepository } from "@/infra/database";

import { LogDTO, Log, LogSimplifiedDTO, TotalDailyLogs, LogType } from "../../domain/models/log";

export type LogRepositoryWhere = { type: LogType; duration: number } & LogDTO;

export interface ILogRepository extends IRepository<Log, LogRepositoryWhere> {
    findSimplified(queryOptions?: QueryOptions): Promise<LogSimplifiedDTO[]>;
    getDailyLogsByProject(projectId: string): Promise<TotalDailyLogs>;
    getHourlyLogsByProject(projectId: string): Promise<TotalDailyLogs[]>;
}
