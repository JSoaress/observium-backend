import { parseNumber } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions, SortParams } from "ts-arch-kit/dist/database";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";
import { HttpServerController as Controller, HttpRequest, HttpResponse, IHttpServer } from "ts-arch-kit/dist/http/server";

import { UseCaseFactory } from "@/app/_common";
import { InvalidTokenError } from "@/app/_common/errors";
import { Project } from "@/app/projects/domain/models/project";
import { APIKey } from "@/app/users/domain/models/api-key";

import * as presenters from "../presenters/json";
import { HttpErrorHandler } from "./HttpErrorHandler";
import { IHandlerConfig } from "./router.builder";

export class HttpServerController extends Controller {
    private httpErrorHandler: HttpErrorHandler;

    constructor(httpServer: IHttpServer, private useCaseFactory: UseCaseFactory) {
        super(httpServer);
        this.httpErrorHandler = new HttpErrorHandler();
    }

    async setup(): Promise<void> {
        const configs: IHandlerConfig[] = [
            // auth
            {
                method: "post",
                path: "/users/auth/login",
                useCase: this.useCaseFactory.authenticateUserUseCase(),
                buildInput: (req) => ({ ...req.body }),
            },
            // users
            {
                method: "post",
                path: "/users",
                useCase: this.useCaseFactory.createUserUseCase(),
                buildInput: (req) => ({ ...req.body }),
                statusCode: HttpStatusCodes.CREATED,
                onSuccess: (value) => {
                    const presenter = new presenters.UserJsonPresenter();
                    return presenter.present(value);
                },
            },
            {
                method: "post",
                path: "/users/activate/:token",
                useCase: this.useCaseFactory.activateUserUseCase(),
                buildInput: (req) => ({ token: req.params.token }),
                statusCode: HttpStatusCodes.NO_CONTENT,
            },
            // api keys
            {
                method: "get",
                path: "/users/api-keys",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.fetchAPIKeysUseCase()),
                buildInput: (req) => ({ queryOptions: req.queryOptions, requestUserToken: req.requestUserToken }),
                onSuccess: (value) => {
                    const { count, results } = value;
                    const presenter = new presenters.APIKeyJsonPresenter();
                    const apiKeysJson = results.map((result: APIKey) => presenter.present(result));
                    return { count, results: apiKeysJson };
                },
            },
            {
                method: "post",
                path: "/users/api-keys",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.createAPIKeyUseCase()),
                buildInput: (req) => ({ ...req.body, requestUserToken: req.requestUserToken }),
                statusCode: HttpStatusCodes.CREATED,
                onSuccess: (value) => {
                    const presenter = new presenters.APIKeyJsonPresenter();
                    return presenter.present(value);
                },
            },
            // projects
            {
                method: "get",
                path: "/projects",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.fetchProjectsByWorkspaceUseCase()),
                buildInput: (req) => ({ queryOptions: req.queryOptions, requestUserToken: req.requestUserToken }),
                onSuccess: (value) => {
                    const { count, results } = value;
                    const presenter = new presenters.ProjectJsonPresenter();
                    const projectsJson = results.map((result: Project) => presenter.present(result));
                    return { count, results: projectsJson };
                },
            },
            {
                method: "post",
                path: "/projects",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.createProjectUseCase()),
                buildInput: (req) => ({ ...req.body, requestUserToken: req.requestUserToken }),
                statusCode: HttpStatusCodes.CREATED,
                onSuccess: (value) => {
                    const presenter = new presenters.ProjectJsonPresenter();
                    return presenter.present(value);
                },
            },
            // logs
            {
                method: "get",
                path: "/projects/:project/logs",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.fetchLogsUseCase()),
                buildInput: (req) => ({
                    queryOptions: req.queryOptions,
                    projectId: req.params.project,
                    requestUserToken: req.requestUserToken,
                }),
            },
            {
                method: "get",
                path: "/projects/logs/:log",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.getLogByIdUseCase()),
                buildInput: (req) => ({ id: req.params.log, requestUserToken: req.requestUserToken }),
                onSuccess: (value) => {
                    const presenter = new presenters.LogJsonPresenter();
                    return presenter.present(value);
                },
            },
            {
                method: "post",
                path: "/projects/:slug/logs/register",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.registerLogUseCase()),
                buildInput: (req) => {
                    const { slug: projectSlug } = req.params;
                    const { body = {}, requestUserToken } = req;
                    if (body.type === "OTHER" && body.context?._msg) {
                        const { path, method, level, context, response, error } = body;
                        const { _msg, ...ctx } = context;
                        return {
                            level,
                            message: _msg,
                            context: {
                                type: "other",
                                className: path,
                                functionName: method,
                                response,
                                ...ctx,
                            },
                            error,
                            projectSlug,
                            requestUserToken,
                        };
                    }
                    return { ...body, projectSlug, requestUserToken };
                },
                statusCode: HttpStatusCodes.CREATED,
            },
            {
                method: "get",
                path: "/projects/:slugOrId/logs/metrics/daily",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.getDailyLogsUseCase()),
                buildInput: (req) => ({ projectIdOrSlug: req.params.slugOrId, requestUserToken: req.requestUserToken }),
            },
            {
                method: "get",
                path: "/projects/:slugOrId/logs/metrics/hourly",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.getHourlyLogsUseCase()),
                buildInput: (req) => ({ projectIdOrSlug: req.params.slugOrId, requestUserToken: req.requestUserToken }),
            },
            // organizations
            {
                method: "post",
                path: "/organizations/workspaces",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.createWorkspaceUseCase()),
                buildInput: (req) => ({ ...req.body, requestUserToken: req.requestUserToken }),
                statusCode: HttpStatusCodes.CREATED,
                onSuccess: (value) => {
                    const presenter = new presenters.WorkspaceJsonPresenter();
                    return presenter.present(value);
                },
            },
            {
                method: "post",
                path: "/organizations/workspaces/:workspace/members",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.addWorkspaceMemberUseCase()),
                buildInput: (req) => ({
                    ...req.body,
                    workspace: req.params.workspace,
                    requestUserToken: req.requestUserToken,
                }),
                statusCode: HttpStatusCodes.NO_CONTENT,
            },
            {
                method: "delete",
                path: "/organizations/workspaces/:workspace/members",
                useCase: this.useCaseFactory.authenticationDecorator(this.useCaseFactory.removeWorkspaceMemberUseCase()),
                buildInput: (req) => ({
                    ...req.body,
                    workspace: req.params.workspace,
                    requestUserToken: req.requestUserToken,
                }),
                statusCode: HttpStatusCodes.NO_CONTENT,
            },
        ];
        this.registerRoutes(configs);
    }

    private registerRoutes(routes: IHandlerConfig[]) {
        routes.forEach((config) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handler: (req: HttpRequest) => Promise<HttpResponse<any>> =
                config.customHandler ?? this.buildDefaultHandler(config);
            this.httpServer.register(config.method, config.path, handler);
        });
    }

    private buildDefaultHandler(config: IHandlerConfig): (req: HttpRequest) => Promise<HttpResponse<unknown>> {
        const PUBLIC_PATHS = ["/users/auth/login", "/users", "/users/activate/:token"];
        return async (req) => {
            if (!config.useCase) throw new Error("Missing handler config.");
            let request = this.queryOptionsMiddleware(req);
            if (!PUBLIC_PATHS.includes(config.path)) request = this.authMiddleware(request);
            const input = config.buildInput ? config.buildInput(request) : null;
            const result = await config.useCase.execute(input);
            if (result.isLeft()) {
                const err = await this.httpErrorHandler.handleError(result.value);
                return { statusCode: err.statusCode, body: err.toJSON() };
            }
            const body = config.onSuccess ? config.onSuccess(result.value) : result.value;
            return { statusCode: config.statusCode || HttpStatusCodes.OK, body };
        };
    }

    private authMiddleware(req: HttpRequest): HttpRequest {
        const authHeader = req.headers?.authorization || "";
        if (!authHeader) throw new InvalidTokenError("Token de autenticação não fornecido.");
        if (Array.isArray(authHeader)) {
            const requestUserToken = authHeader.length ? authHeader[0] : "";
            return { ...req, requestUserToken };
        }
        return { ...req, requestUserToken: authHeader };
    }

    private queryOptionsMiddleware(req: HttpRequest): HttpRequest {
        const { offset, limit: limitStr, sort: sortRaw, ...filter } = req.query || {};
        const skip = parseNumber(offset);
        const limit = parseNumber(limitStr, 30);
        const ordinations = sortRaw ? (sortRaw as string).split(",") : [];
        const sortColumns: SortParams[] = [];
        ordinations.forEach((sort) => {
            const field = sort.trim();
            if (field.startsWith("-")) sortColumns.push({ column: field.slice(1), order: "desc" });
            else sortColumns.push({ column: field, order: "asc" });
        });
        const queryOptions: QueryOptions = { filter, pagination: { limit, skip }, sort: sortColumns };
        return { ...req, queryOptions };
    }
}
