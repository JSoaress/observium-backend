import { HttpMethods, HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpResponse } from "ts-arch-kit/dist/http/server";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { ActivateUserUseCase } from "@/app/users/application/use-cases/users/activate-user";

import { HttpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";

export class ActivateUserHttpRoute extends HttpRoute {
    constructor(private useCase: ActivateUserUseCase, httpErrorHandler: HttpErrorHandler) {
        super(httpErrorHandler);
    }

    getMethod(): HttpMethods {
        return "post";
    }

    getRoute(): string {
        return "/users/activate/:token";
    }

    protected async execute(request: HttpRequest): Promise<HttpResponse<Record<string, unknown>>> {
        const { token } = request.params;
        const response = await this.useCase.execute({ token: token as string });
        if (response.isLeft()) return this.handleError(response.value);
        return { statusCode: HttpStatusCodes.NO_CONTENT };
    }
}
