import { UseCaseFactory } from "@/app/_common";

import { IHttpMiddleware } from "../../middlewares";
import { httpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";
import { HttpRouter } from "../HttpRouter";
import { ActivateUserHttpRoute } from "./ActivateUserHttpRoute";
import { AuthenticateUserHttpRoute } from "./AuthenticateUserHttpRoute";
import { CreateAPIKeyHttpRoute } from "./CreateAPIKeyHttpRoute";
import { CreateUserHttpRoute } from "./CreateUserHttpRoute";
import { FetchAPIKeysHttpRoute } from "./FetchAPIKeysHttpRoute";

export class UsersRouter extends HttpRouter {
    constructor(useCaseFactory: UseCaseFactory, ...middlewares: IHttpMiddleware[]) {
        super(useCaseFactory, ...middlewares);
    }

    getRoutes(): HttpRoute[] {
        return [
            new CreateUserHttpRoute(this.useCaseFactory.createUserUseCase(), httpErrorHandler),
            new ActivateUserHttpRoute(this.useCaseFactory.activateUserUseCase(), httpErrorHandler),
            new AuthenticateUserHttpRoute(this.useCaseFactory.authenticateUserUseCase(), httpErrorHandler),
            new FetchAPIKeysHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.fetchAPIKeysUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new CreateAPIKeyHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.createAPIKeyUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
        ];
    }
}
