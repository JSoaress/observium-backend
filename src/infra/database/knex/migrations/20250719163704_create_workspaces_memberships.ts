import { Knex } from "knex";

const TABLE_NAME = "workspaces_memberships";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.uuid("workspace_id").references("workspaces.id").notNullable();
        table.uuid("user_id").references("users.id").notNullable();
        table.string("role").notNullable();
        table.unique(["workspace_id", "user_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
