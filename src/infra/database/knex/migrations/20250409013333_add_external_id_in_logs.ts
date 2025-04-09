import { Knex } from "knex";

const TABLE_NAME = "logs";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string("external_id");
        table.index("external_id");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("external_id");
    });
}
