import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { GetHourlyLogsUseCase } from "@/app/logs/application/use-cases/logs/get-hourly-logs";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class GetHourlyLogsHttpRoute extends HttpRoute {
    constructor(
        private useCase: GetHourlyLogsUseCase,
        httpErrorHandler: HttpErrorHandler,
        ...middlewares: IHttpMiddleware[]
    ) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "get";
    }

    getRoute(): string {
        return "/projects/:slugOrId/logs/metrics/hourly";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { slugOrId } = request.params;
        const { requestUserToken } = request;
        const response = await this.useCase.execute({ projectIdOrSlug: slugOrId as string, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        return { statusCode: HttpStatusCodes.OK, body: response.value };
    }
}
