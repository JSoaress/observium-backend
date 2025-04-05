import { Knex } from "knex";
import { parseNumber } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";
import {
    UnitOfWork,
    Where,
    QueryOptions,
    QueryOptionsWithoutPagination,
    DbTransactionNotPreparedError,
    IMapper,
} from "ts-arch-kit/dist/database";

import { Model } from "@/app/_common";

import { DbFilterOptions, IRepository } from "../../helpers";
import { KnexModel } from "../models";
import { KnexDatabaseFilter } from "./KnexDatabaseFilter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DefaultKnexRepository<TDomain extends Model<any>, TPersistence extends KnexModel>
    implements IRepository<TDomain>
{
    protected uow?: UnitOfWork<Knex.Transaction>;

    constructor(
        readonly tableName: string,
        readonly mapper: IMapper<TDomain, TPersistence>,
        readonly filterOptions: DbFilterOptions
    ) {}

    setUnitOfWork(uow: UnitOfWork<Knex.Transaction>): void {
        this.uow = uow;
    }

    async count(filter?: Where<Record<string, unknown>>): Promise<number> {
        const client = this.getTransaction();
        const conn = client(this.tableName).count("id");
        if (filter) this.filter(conn, filter);
        const [result] = await conn;
        return parseNumber(result.count);
    }

    async exists(where?: Where<Record<string, unknown>>): Promise<boolean> {
        const count = await this.count(where);
        return count >= 1;
    }

    async find(queryOptions?: QueryOptions<Record<string, unknown>>): Promise<TDomain[]> {
        const client = this.getTransaction();
        const { filter, pagination, sort } = queryOptions || {};
        const conn = client(this.tableName).select("*");
        this.filter(conn, filter);
        if (sort) {
            sort.forEach((s) => {
                conn.orderBy(s.column, s.order, s.nulls);
            });
        }
        if (pagination) conn.limit(pagination.limit).offset(pagination.skip);
        const rows = await conn;
        return rows.map((row) => this.mapper.toDomain(row));
    }

    async findOne(queryOptions?: QueryOptionsWithoutPagination<Record<string, unknown>>): Promise<TDomain | null> {
        const [object] = await this.find({ ...queryOptions, pagination: { limit: 1, skip: 0 } });
        return object || null;
    }

    async findById(id: PrimaryKey): Promise<TDomain | null> {
        return this.findOne({ filter: { id } });
    }

    async save(data: TDomain): Promise<TDomain> {
        const client = this.getTransaction();
        const objToPersist = this.mapper.toPersistence(data);
        if (data.isNew) {
            const [persistedObj] = await client(this.tableName).insert(objToPersist, "*");
            return this.mapper.toDomain(persistedObj);
        }
        const [updatedObj] = await client(this.tableName).update(objToPersist, "*").where({ id: data.getId() });
        return this.mapper.toDomain(updatedObj);
    }

    async destroy(model: TDomain): Promise<void> {
        const client = this.getTransaction();
        await client(this.tableName).where({ id: model.getId() }).del();
    }

    getTransaction(): Knex.Transaction {
        if (!this.uow)
            throw new DbTransactionNotPreparedError(`O UnitOfWork não foi preparado para a tabela "${this.tableName}".`);
        return this.uow.getTransaction();
    }

    filter(conn: Knex.QueryBuilder, filter?: Where) {
        const knexDatabaseFilter = new KnexDatabaseFilter(conn);
        knexDatabaseFilter.filter(this.filterOptions, filter);
    }
}
