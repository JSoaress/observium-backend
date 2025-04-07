import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { FetchProjectsUseCase } from "@/app/logs/application/use-cases/projects/fetch-projects";
import { ProjectJsonPresenter } from "@/infra/presenters/json";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class FetchProjectsHttpRoute extends HttpRoute {
    constructor(
        private useCase: FetchProjectsUseCase,
        httpErrorHandler: HttpErrorHandler,
        ...middlewares: IHttpMiddleware[]
    ) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "get";
    }

    getRoute(): string {
        return "/projects";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { queryOptions, requestUserToken } = request;
        const response = await this.useCase.execute({ queryOptions, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        const presenter = new ProjectJsonPresenter();
        const { count, results } = response.value;
        const projectsJson = results.map((result) => presenter.present(result));
        return { statusCode: HttpStatusCodes.OK, body: { count, results: projectsJson } };
    }
}
