import { UseCaseFactory } from "@/app/_common";

import { IHttpMiddleware } from "../../middlewares";
import { httpErrorHandler } from "../HttpErrorHandler";
import { HttpRoute } from "../HttpRoute";
import { HttpRouter } from "../HttpRouter";
import { CreateProjectHttpRoute } from "./CreateProjectHttpRoute";
import { FetchLogsHttpRoute } from "./FetchLogsHttpRoute";
import { FetchProjectsHttpRoute } from "./FetchProjectsHttpRoute";
import { GetDailyLogsHttpRoute } from "./GetDailyLogsHttpRoute";
import { GetHourlyLogsHttpRoute } from "./GetHourlyLogsHttpRoute";
import { GetLogByIdHttpRoute } from "./GetLogByIdHttpRoute";
import { RegisterLogHttpRoute } from "./RegisterLogHttpRoute";

export class LogsRouter extends HttpRouter {
    constructor(useCaseFactory: UseCaseFactory, ...middlewares: IHttpMiddleware[]) {
        super(useCaseFactory, ...middlewares);
    }

    getRoutes(): HttpRoute[] {
        return [
            new CreateProjectHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.createProjectUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new RegisterLogHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.registerLogUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new FetchProjectsHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.fetchProjectsUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new GetDailyLogsHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.getDailyLogsUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new GetHourlyLogsHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.getHourlyLogsUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new GetLogByIdHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.getLogByIdUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
            new FetchLogsHttpRoute(
                this.useCaseFactory.authenticationDecorator(this.useCaseFactory.fetchLogsUseCase()),
                httpErrorHandler,
                ...this.middlewares
            ),
        ];
    }
}
