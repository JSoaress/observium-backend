import { Knex } from "knex";

const TABLE_NAME = "logs";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("id");
    });
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.increments("id");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("id");
    });
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
    });
}
