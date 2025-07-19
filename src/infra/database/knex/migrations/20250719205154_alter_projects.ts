import { Knex } from "knex";

const TABLE_NAME = "projects";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("user_id");
        table.uuid("workspace_id").references("workspaces.id").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn("workspace_id");
        table.uuid("user_id").references("users.id");
    });
}
