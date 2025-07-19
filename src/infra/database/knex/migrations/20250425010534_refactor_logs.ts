/* eslint-disable @typescript-eslint/no-unused-vars */
import { Knex } from "knex";

const TABLE_NAME = "logs";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumns("path", "method", "status_code", "status_text", "context", "response", "error");
    });
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string("message").notNullable().defaultTo("");
        table.jsonb("context").defaultTo(null);
        table.jsonb("error").defaultTo(null);
        table.text("stack").defaultTo(null);
        table.index("type");
        table.index("created_at");
    });
}

export async function down(knex: Knex): Promise<void> {
    // empty
}
