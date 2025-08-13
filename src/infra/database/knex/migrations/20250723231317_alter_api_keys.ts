import { Knex } from "knex";

const TABLE_NAME = "api_keys";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("user_id");
        table.uuid("project_id").references("projects.id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("project_id");
        table.uuid("user_id").references("users.id");
    });
}
