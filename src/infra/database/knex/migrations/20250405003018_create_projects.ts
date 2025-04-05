import { Knex } from "knex";

const TABLE_NAME = "projects";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.string("name").notNullable();
        table.string("description").defaultTo(null);
        table.string("slug").notNullable();
        table.string("url").defaultTo(null);
        table.uuid("user_id").notNullable().references("users.id");
        table.unique(["slug", "user_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
