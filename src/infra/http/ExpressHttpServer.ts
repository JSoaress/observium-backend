import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Server } from "http";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { HttpMethods } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest, IHttpServer } from "ts-arch-kit/dist/http/server/http-server";

import { UnknownError } from "@/app/_common/errors";
import { env } from "@/shared/config/environment";

import { HttpRouteNotFoundError } from "../errors";
import { httpErrorHandler } from "./HttpErrorHandler";

export class ExpressHttpServer implements IHttpServer {
    private app: express.Express;
    private BASE_URL = "/api/v1.0";

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors({ origin: env.allowedHost }));
        this.app.use(helmet());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register(method: HttpMethods, url: string, callback: <T = any>(req: HttpRequest) => Promise<HttpResponse<T>>): void {
        this.app[method](`${this.BASE_URL}${url}`, async (req, res) => {
            try {
                const { params, query, headers, body } = req;
                const response = await callback({ params, query, headers, body, requestUserToken: "" });
                res.status(response.statusCode).send(response.body);
            } catch (error) {
                if (error instanceof BasicError) {
                    const handledError = await httpErrorHandler.handleError(error);
                    res.status(handledError.statusCode).send(handledError.toJSON());
                }
                const handledError = await httpErrorHandler.handleError(new UnknownError(error));
                res.status(handledError.statusCode).send(handledError.toJSON());
            }
        });
    }

    async listen(port: number, callback?: () => Promise<void> | void): Promise<void> {
        this.app.use(async (req, res, next) => {
            const err = await httpErrorHandler.handleError(new HttpRouteNotFoundError(req.method, req.url));
            res.status(err.statusCode).json(err);
            next();
        });
        const cb = callback || (() => console.info(`Server running on port ${port} with express.`));
        this.app.listen(port, cb);
    }

    getServer(): Server {
        throw new Error("Method not implemented.");
    }
}
