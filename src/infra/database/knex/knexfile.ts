import dotenv from "dotenv";
import type { Knex } from "knex";

dotenv.config({ path: "../../../../.env" });

const config: { [key: string]: Knex.Config } = {
    test: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3",
        },
    },
    development: {
        client: "pg",
        connection: {
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            database: process.env.DATABASE_DB,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
            afterCreate: (conn, done) => {
                conn.query("SET timezone='America/Sao_Paulo'", (err) => {
                    done(err, conn);
                });
            },
        },
        migrations: {
            extension: "ts",
            stub: "migration.stub",
            tableName: "knex_migrations",
        },
    },
    staging: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
    production: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
};

export default config;
