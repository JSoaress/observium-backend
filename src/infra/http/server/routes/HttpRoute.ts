/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { HttpMethods } from "ts-arch-kit/dist/http/http";
import { HttpRequest, HttpResponse } from "ts-arch-kit/dist/http/server";

import { IHttpMiddleware } from "../middlewares";
import { HttpErrorHandler } from "./HttpErrorHandler";

export abstract class HttpRoute {
    private middlewares: IHttpMiddleware[] = [];

    constructor(protected httpErrorHandler: HttpErrorHandler, ...middlewares: IHttpMiddleware[]) {
        this.middlewares = middlewares;
    }

    abstract getMethod(): HttpMethods;

    abstract getRoute(): string;

    protected abstract execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>>;

    async handle(req: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        try {
            const { body, headers, params, query, requestUserToken, queryOptions } = req;
            let request: HttpRequest = { body, headers, params, query, requestUserToken, queryOptions };
            for (const middleware of this.middlewares) {
                const requestOrError = await middleware.execute(request);
                if (requestOrError.isLeft()) return this.handleError(requestOrError.value);
                request = requestOrError.value;
            }
            return this.execute(request);
        } catch (error) {
            const { message } = error as Error;
            return { statusCode: 500, body: { message } };
        }
    }

    protected async handleError(error: BasicError | Error): Promise<HttpResponse> {
        const err = await this.httpErrorHandler.handleError(error);
        return { statusCode: err.statusCode, body: err.toJSON() };
    }
}
