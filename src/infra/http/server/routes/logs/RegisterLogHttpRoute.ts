import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { RegisterLogUseCase } from "@/app/logs/application/use-cases/logs/register-log";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class RegisterLogHttpRoute extends HttpRoute {
    constructor(private useCase: RegisterLogUseCase, httpErrorHandler: HttpErrorHandler, ...middlewares: IHttpMiddleware[]) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "post";
    }

    getRoute(): string {
        return "/projects/:slug/logs/register";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { slug } = request.params;
        const { body, requestUserToken } = request;
        const response = await this.useCase.execute({ ...body, projectSlug: slug as string, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        return { statusCode: HttpStatusCodes.CREATED, body: response.value };
    }
}
