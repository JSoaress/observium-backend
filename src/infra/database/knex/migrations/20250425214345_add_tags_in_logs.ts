import { Knex } from "knex";

const TABLE_NAME = "table_name";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string("tags").defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("tags");
    });
}
