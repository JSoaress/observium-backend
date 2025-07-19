import { Knex } from "knex";

const TABLE_NAME = "workspaces";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.string("name").notNullable();
        table.uuid("owner_id").references("users.id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
