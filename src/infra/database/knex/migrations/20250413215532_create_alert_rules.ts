import { Knex } from "knex";

const TABLE_NAME = "alert_rules";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.string("description").notNullable();
        table.uuid("project_id").notNullable().references("projects.id");
        table.string("condition_level").notNullable();
        table.integer("condition_count").defaultTo(0);
        table.integer("within_minutes").defaultTo(0);
        table.string("action_type").notNullable();
        table.string("action_to").notNullable();
        table.boolean("active").defaultTo(true);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
