import { UseCaseFactory } from "@/app/_common";

import { IHttpMiddleware } from "../middlewares";
import { HttpRoute } from "./HttpRoute";

export abstract class HttpRouter {
    protected middlewares: IHttpMiddleware[];

    constructor(protected useCaseFactory: UseCaseFactory, ...middlewares: IHttpMiddleware[]) {
        this.middlewares = middlewares;
    }

    abstract getRoutes(): HttpRoute[];
}
