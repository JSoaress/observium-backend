import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { FetchLogsUseCase } from "@/app/logs/application/use-cases/logs/fetch-logs";
import { LogSimplifiedJsonPresenter } from "@/infra/presenters/json";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class FetchLogsHttpRoute extends HttpRoute {
    constructor(private useCase: FetchLogsUseCase, httpErrorHandler: HttpErrorHandler, ...middlewares: IHttpMiddleware[]) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "get";
    }

    getRoute(): string {
        return "/projects/:project/logs";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { project } = request.params;
        const { queryOptions, requestUserToken } = request;
        const response = await this.useCase.execute({ queryOptions, projectId: project as string, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        const presenter = new LogSimplifiedJsonPresenter();
        const { count, results: logs } = response.value;
        const results = logs.map((log) => presenter.present(log));
        return { statusCode: HttpStatusCodes.OK, body: { count, results } };
    }
}
