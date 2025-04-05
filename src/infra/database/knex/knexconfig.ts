import knex from "knex";

import config from "./knexfile";

export const knexConfig = knex(config.development);
