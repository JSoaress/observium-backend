import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { AuthenticateUserUseCase } from "@/app/auth/application/use-cases/authenticate-user";

import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class AuthenticateUserHttpRoute extends HttpRoute {
    constructor(private useCase: AuthenticateUserUseCase, httpErrorHandler: HttpErrorHandler) {
        super(httpErrorHandler);
    }

    getMethod(): HttpMethods {
        return "post";
    }

    getRoute(): string {
        return "/users/auth/login";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { body } = request;
        const response = await this.useCase.execute(body);
        if (response.isLeft()) return this.handleError(response.value);
        return { statusCode: HttpStatusCodes.OK, body: response.value };
    }
}
