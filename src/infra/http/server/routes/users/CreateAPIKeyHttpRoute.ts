import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { CreateAPIKeyUseCase } from "@/app/users/application/use-cases/api-keys/create-api-key";
import { APIKeyJsonPresenter } from "@/infra/presenters/json";

import { IHttpMiddleware } from "../../middlewares";
import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class CreateAPIKeyHttpRoute extends HttpRoute {
    constructor(
        private useCase: CreateAPIKeyUseCase,
        httpErrorHandler: HttpErrorHandler,
        ...middlewares: IHttpMiddleware[]
    ) {
        super(httpErrorHandler, ...middlewares);
    }

    getMethod(): HttpMethods {
        return "post";
    }

    getRoute(): string {
        return "/users/api-keys";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { body, requestUserToken } = request;
        const response = await this.useCase.execute({ ...body, requestUserToken });
        if (response.isLeft()) return this.handleError(response.value);
        const presenter = new APIKeyJsonPresenter();
        return { statusCode: HttpStatusCodes.CREATED, body: presenter.present(response.value) };
    }
}
