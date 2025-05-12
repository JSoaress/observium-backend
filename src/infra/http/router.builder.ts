/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUseCase } from "ts-arch-kit/dist/core/application";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either } from "ts-arch-kit/dist/core/helpers";
import { HttpMethods } from "ts-arch-kit/dist/http";
import { HttpRequest, HttpResponse } from "ts-arch-kit/dist/http/server";

export interface IHandlerConfig {
    method: HttpMethods;
    path: string;
    useCase?: IUseCase<unknown, Either<BasicError, unknown>>;
    buildInput?: (req: HttpRequest) => any;
    onSuccess?: (value: any) => any;
    customHandler?: (req: HttpRequest) => Promise<HttpResponse<any>>;
    statusCode?: number;
}
