import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { FetchAPIKeysUseCase } from "@/app/users/application/use-cases/api-keys/fetch-api-keys";
import { APIKeyJsonPresenter } from "@/infra/presenters/json";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class FetchAPIKeysHttpRoute extends HttpRoute {
    constructor(
        private useCase: FetchAPIKeysUseCase,
        httpErrorHandler: HttpErrorHandler,
        ...middlewares: IHttpMiddleware[]
    ) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "get";
    }

    getRoute(): string {
        return "/users/api-keys";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { queryOptions, requestUserToken } = request;
        const response = await this.useCase.execute({ queryOptions, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        const presenter = new APIKeyJsonPresenter();
        const { count, results } = response.value;
        const apiKeysJson = results.map((result) => presenter.present(result));
        return { statusCode: HttpStatusCodes.OK, body: { count, results: apiKeysJson } };
    }
}
