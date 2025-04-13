import { parseNumber } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { ILogRepository } from "@/app/logs/application/repos";
import { Log, LogSimplifiedDTO, TotalDailyLogs } from "@/app/logs/domain/models/log";

import { KNEX_LOG_FILTER, KnexLogMapper } from "../mappers";
import { KnexLogDTO } from "../models";
import { DefaultKnexRepository } from "./DefaultKnexRepository";

type KnexGetDailyLogs = {
    today: Date;
    total_logs: number;
    total_silly: number;
    total_debug: number;
    total_info: number;
    total_warn: number;
    total_error: number;
    total_critical: number;
};

type KnexGetHourlyLogs = Omit<KnexGetDailyLogs, "today"> & { hour: Date };

export class KnexLogRepository extends DefaultKnexRepository<Log, KnexLogDTO> implements ILogRepository {
    constructor() {
        super("logs", new KnexLogMapper(), KNEX_LOG_FILTER);
    }

    async findSimplified(queryOptions?: QueryOptions): Promise<LogSimplifiedDTO[]> {
        const client = this.getTransaction();
        const { filter, pagination, sort } = queryOptions || {};
        const conn = client(this.tableName).select(
            "id",
            "type",
            "project_id",
            "path",
            "method",
            "external_id",
            "status_code",
            "status_text",
            "level",
            "duration",
            "created_at"
        );
        this.filter(conn, filter);
        if (sort) {
            const { columns } = this.filterOptions;
            sort.forEach((s) => {
                conn.orderBy(columns[s.column].columnName, s.order, s.nulls);
            });
        }
        if (pagination) conn.limit(pagination.limit).offset(pagination.skip);
        const rows = await conn;
        return rows.map((row) => ({
            id: row.id,
            type: row.type,
            projectId: row.project_id,
            path: row.path,
            method: row.method,
            externalId: row.external_id,
            statusCode: row.status_code,
            statusText: row.status_text,
            level: row.level,
            duration: parseNumber(row.duration),
            createdAt: row.created_at,
        }));
    }

    async getDailyLogsByProject(projectId: string): Promise<TotalDailyLogs> {
        const client = this.getTransaction();
        const conn = client.raw<{ rows: KnexGetDailyLogs[] }>(`SELECT 
                DATE_TRUNC('day', l.created_at) AS today,
                COUNT(l.id) AS total_logs,
                COUNT(l.id) FILTER (WHERE l.level = 'silly') AS total_silly,
                COUNT(l.id) FILTER (WHERE l.level = 'debug') AS total_debug,
                COUNT(l.id) FILTER (WHERE l.level = 'info') AS total_info,
                COUNT(l.id) FILTER (WHERE l.level = 'warn') AS total_warn,
                COUNT(l.id) FILTER (WHERE l.level = 'error') AS total_error,
                COUNT(l.id) FILTER (WHERE l.level = 'critical') AS total_critical
                FROM logs l
                WHERE l.created_at::date = CURRENT_DATE AND l.project_id = '${projectId}'
                GROUP BY today`);
        const { rows } = await conn;
        return {
            date: rows[0]?.today || new Date(),
            logs: parseNumber(rows[0]?.total_logs),
            silly: parseNumber(rows[0]?.total_silly),
            debug: parseNumber(rows[0]?.total_debug),
            info: parseNumber(rows[0]?.total_info),
            warn: parseNumber(rows[0]?.total_warn),
            error: parseNumber(rows[0]?.total_error),
            critical: parseNumber(rows[0]?.total_critical),
        };
    }

    async getHourlyLogsByProject(projectId: string): Promise<TotalDailyLogs[]> {
        const client = this.getTransaction();
        const conn = client.raw<{ rows: KnexGetHourlyLogs[] }>(`SELECT 
            DATE_TRUNC('hour', l.created_at) AS hour,
            COUNT(l.id) AS total_logs,
            COUNT(l.id) FILTER (WHERE l.level = 'silly') AS total_silly,
            COUNT(l.id) FILTER (WHERE l.level = 'debug') AS total_debug,
            COUNT(l.id) FILTER (WHERE l.level = 'info') AS total_info,
            COUNT(l.id) FILTER (WHERE l.level = 'warn') AS total_warn,
            COUNT(l.id) FILTER (WHERE l.level = 'error') AS total_error,
            COUNT(l.id) FILTER (WHERE l.level = 'critical') AS total_critical
            FROM logs l
            WHERE l.created_at::date = CURRENT_DATE AND l.project_id = '${projectId}'
            GROUP BY hour`);
        const { rows } = await conn;
        return rows.map<TotalDailyLogs>((row) => ({
            date: row.hour,
            logs: parseNumber(row.total_logs),
            silly: parseNumber(row.total_silly),
            debug: parseNumber(row.total_debug),
            info: parseNumber(row.total_info),
            warn: parseNumber(row.total_warn),
            error: parseNumber(row.total_error),
            critical: parseNumber(row.total_critical),
        }));
    }
}
