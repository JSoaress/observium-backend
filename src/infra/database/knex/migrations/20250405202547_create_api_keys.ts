import { Knex } from "knex";

const TABLE_NAME = "api_keys";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid("id").primary();
        table.string("alias", 30).notNullable();
        table.string("key").notNullable();
        table.uuid("user_id").references("users.id").notNullable();
        table.datetime("expires_in").defaultTo(null);
        table.boolean("active").defaultTo(true);
        table.index("key");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TABLE_NAME);
}
