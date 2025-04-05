import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either } from "ts-arch-kit/dist/core/helpers";
import { HttpRequest } from "ts-arch-kit/dist/http/server";

export interface IHttpMiddleware {
    execute(req: HttpRequest): Promise<Either<BasicError | Error, HttpRequest>>;
}
