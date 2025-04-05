import { Knex } from "knex";

const TABLE_NAME = "logs";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.string("type").notNullable();
        table.uuid("project_id").references("projects.id").notNullable();
        table.string("path").notNullable();
        table.string("method").defaultTo("");
        table.integer("status_code").notNullable().defaultTo(0);
        table.string("status_text").defaultTo(null);
        table.decimal("duration", 10, 4).defaultTo(0);
        table.jsonb("context").defaultTo(null);
        table.jsonb("response").defaultTo(null);
        table.jsonb("error").defaultTo(null);
        table.datetime("created_at");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
