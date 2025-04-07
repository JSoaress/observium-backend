import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { GetLogByIdUseCase } from "@/app/logs/application/use-cases/logs/get-log-by-id";
import { LogJsonPresenter } from "@/infra/presenters/json";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class GetLogByIdHttpRoute extends HttpRoute {
    constructor(private useCase: GetLogByIdUseCase, httpErrorHandler: HttpErrorHandler, ...middlewares: IHttpMiddleware[]) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "get";
    }

    getRoute(): string {
        return "/projects/logs/:log";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { log } = request.params;
        const { requestUserToken } = request;
        const response = await this.useCase.execute({ id: log as string, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        const presenter = new LogJsonPresenter();
        return { statusCode: HttpStatusCodes.OK, body: presenter.present(response.value) };
    }
}
