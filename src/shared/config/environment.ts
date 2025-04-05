import envVar from "env-var";

export const env = {
    nodeEnv: envVar.get("NODE_ENV").default("development").asString(),
    platformName: envVar.get("PLATFORM").default("Observium").asString(),
    allowedHost: envVar.get("ALLOWED_HOST").default("*").asString(),
    authTokenSecret: envVar.get("JWT_TOKEN_SECRET").required().asString(),
    authTokenExpiresIn: envVar.get("JWT_TOKEN_EXPIRES_IN").default("1d").asString(),
    databaseProvider: envVar.get("DATABASE_PROVIDER").required().asString(),
    databaseHost: envVar.get("DATABASE_HOST").required().asString(),
    databasePort: envVar.get("DATABASE_PORT").required().asInt(),
    databaseName: envVar.get("DATABASE_DB").required().asString(),
    databaseUser: envVar.get("DATABASE_USER").required().asString(),
    databasePassword: envVar.get("DATABASE_PASSWORD").required().asString(),
    mailProvider: envVar.get("MAIL_PROVIDER").required().asString(),
    mailHost: envVar.get("MAIL_HOST").required().asString(),
    mailPort: envVar.get("MAIL_PORT").required().asInt(),
    mailUser: envVar.get("MAIL_USER").required().asEmailString(),
    mailPass: envVar.get("MAIL_PASS").required().asString(),
    webUrl: envVar.get("WEB_URL").required().asUrlString(),
};
