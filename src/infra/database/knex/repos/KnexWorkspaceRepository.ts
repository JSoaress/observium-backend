import { Knex } from "knex";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { User } from "@/app/users/domain/models/user";

import { KNEX_WORKSPACE_FILTER, KnexWorkspaceMapper } from "../mappers";
import { KnexWorkspaceDTO } from "../models";
import { DefaultKnexRepository } from "./DefaultKnexRepository";

export class KnexWorkspaceRepository
    extends DefaultKnexRepository<Workspace, KnexWorkspaceDTO>
    implements IWorkspaceRepository
{
    constructor() {
        super("workspaces", new KnexWorkspaceMapper(), KNEX_WORKSPACE_FILTER);
    }

    getByUser(user: User, queryOptions?: QueryOptions): Promise<Workspace[]> {
        throw new Error("Method not implemented.");
    }

    async find(queryOptions?: QueryOptions<Record<string, unknown>>): Promise<Workspace[]> {
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
        const workspaces = await Promise.all<KnexWorkspaceDTO>(
            rows.map(async (row) => {
                const members = await client("workspaces_memberships").select().where({ workspace_id: row.id });
                return { ...row, members };
            })
        );
        return workspaces.map((row) => this.mapper.toDomain(row));
    }

    async save(data: Workspace): Promise<Workspace> {
        const client = this.getTransaction();
        const objToPersist = this.mapper.toPersistence(data);
        if (data.isNew) {
            const { members, ...rest } = objToPersist;
            await client(this.tableName).insert(rest, "*");
            await this.manageMemberships(objToPersist, client);
            return data;
        }
        const { members, ...rest } = objToPersist;
        await client(this.tableName).update(rest, "*").where({ id: data.getId() });
        await this.manageMemberships(objToPersist, client);
        return data;
    }

    private async manageMemberships(workspace: KnexWorkspaceDTO, trx: Knex.Transaction) {
        await trx("workspaces_memberships").where({ workspace_id: workspace.id }).del();
        await trx("workspaces_memberships").insert(workspace.members);
    }
}
