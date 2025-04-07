import { HttpServerController as Controller, IHttpServer } from "ts-arch-kit/dist/http/server";

import { UseCaseFactory } from "@/app/_common";

import { AuthHttpMiddleware, IHttpMiddleware, QueryOptionsHttpMiddleware } from "./middlewares";
import { HttpRoute } from "./routes";
import { LogsRouter } from "./routes/logs";
import { UsersRouter } from "./routes/users";

export class HttpServerController extends Controller {
    private middlewares: IHttpMiddleware[] = [];

    constructor(httpServer: IHttpServer, private useCaseFactory: UseCaseFactory) {
        super(httpServer);
        this.middlewares.push(new QueryOptionsHttpMiddleware(), new AuthHttpMiddleware());
    }

    async setup(): Promise<void> {
        this.registerRoutes(new UsersRouter(this.useCaseFactory, ...this.middlewares).getRoutes());
        this.registerRoutes(new LogsRouter(this.useCaseFactory, ...this.middlewares).getRoutes());
    }

    private registerRoutes(routes: HttpRoute[]) {
        routes.forEach((route) => {
            this.httpServer.register(route.getMethod(), route.getRoute(), async (req) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return route.handle(req) as any;
            });
        });
    }
}
