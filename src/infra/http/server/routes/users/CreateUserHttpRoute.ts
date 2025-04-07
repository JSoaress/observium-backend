import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { CreateUserUseCase } from "@/app/users/application/use-cases/users/create-user";
import { UserJsonPresenter } from "@/infra/presenters/json";

import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class CreateUserHttpRoute extends HttpRoute {
    constructor(private useCase: CreateUserUseCase, httpErrorHandler: HttpErrorHandler) {
        super(httpErrorHandler);
    }

    getMethod(): HttpMethods {
        return "post";
    }

    getRoute(): string {
        return "/users";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { body } = request;
        const response = await this.useCase.execute(body);
        if (response.isLeft()) return this.handleError(response.value);
        const presenter = new UserJsonPresenter();
        return { statusCode: HttpStatusCodes.CREATED, body: presenter.present(response.value) };
    }
}
