import { Knex } from "knex";

const TABLE_NAME = "user_tokens";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.uuid("user_id").notNullable().references("users.id");
        table.string("token").notNullable();
        table.string("type", 15).notNullable();
        table.datetime("created_at").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
