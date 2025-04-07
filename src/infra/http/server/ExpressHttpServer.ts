import cors from "cors";
import helmet from "helmet";
import { ExpressHttpServer as Express } from "ts-arch-kit/dist/http/server/implementations";

import { HttpRouteNotFoundError } from "@/infra/errors";
import { env } from "@/shared/config/environment";

import { httpErrorHandler } from "./routes/HttpErrorHandler";

export class ExpressHttpServer extends Express {
    constructor() {
        super("/api/v1.0");
        this.app.use(cors({ origin: env.allowedHost }));
        this.app.use(helmet());
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
}
