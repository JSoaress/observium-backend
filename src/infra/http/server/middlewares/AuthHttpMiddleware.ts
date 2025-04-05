import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { InvalidTokenError } from "@/app/_common/errors";

import { IHttpMiddleware } from "./IHttpMiddleware";

export class AuthHttpMiddleware implements IHttpMiddleware {
    async execute(req: HttpRequest): Promise<Either<BasicError | Error, HttpRequest>> {
        const authHeader = req.headers?.authorization || "";
        if (!authHeader) return left(new InvalidTokenError("Token de autenticação não fornecido."));
        if (Array.isArray(authHeader)) {
            const requestUserToken = authHeader.length ? authHeader[0] : "";
            return right({ ...req, requestUserToken });
        }
        const [, requestUserToken] = authHeader.split(" ");
        return right({ ...req, requestUserToken });
    }
}
