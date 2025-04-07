import { UseCaseFactory } from "./app/_common";
import { JsonWebToken } from "./infra/adapters/jwt";
import { RepositoryFactory } from "./infra/database";
import { ExpressHttpServer, HttpServerController } from "./infra/http/server";
import { MailFactory } from "./infra/providers/mail";
import { NodeWebSocket } from "./infra/socket";
import { env } from "./shared/config/environment";

async function bootstrap() {
    const repositoryFactory = RepositoryFactory.getRepository(env.databaseProvider);
    const mailProvider = MailFactory.getMail(env.mailProvider);
    const jwtAdapter = new JsonWebToken();
    const webSocket = new NodeWebSocket();
    const useCaseFactory = new UseCaseFactory(repositoryFactory, mailProvider, jwtAdapter, webSocket);
    const httpServer = new ExpressHttpServer();
    const httpServerController = new HttpServerController(httpServer, useCaseFactory);
    await httpServerController.setup();
    await httpServer.listen(8080);
}

bootstrap();
