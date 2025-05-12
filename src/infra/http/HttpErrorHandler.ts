import { BasicError, ErrorHandler } from "ts-arch-kit/dist/core/errors";
import { HttpError, HttpStatusCodes } from "ts-arch-kit/dist/http";

import * as appErrors from "@/app/_common/errors";
import * as infraErrors from "@/infra/errors";

export class HttpErrorHandler extends ErrorHandler<HttpError> {
    async handleError(err: Error): Promise<HttpError> {
        console.log(err);
        if (!(err instanceof BasicError))
            return new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, new appErrors.UnknownError(err));
        if (!super.isTrustedError(err)) return new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err);
        switch (err.constructor) {
            // 400
            case appErrors.MissingParamError:
                return new HttpError(HttpStatusCodes.BAD_REQUEST, err);
            // 401
            case appErrors.InvalidCredentialsError:
            case appErrors.InvalidTokenError:
                return new HttpError(HttpStatusCodes.UNAUTHORIZED, err);
            // 404
            case appErrors.NotFoundModelError:
            case infraErrors.HttpRouteNotFoundError:
                return new HttpError(HttpStatusCodes.NOT_FOUND, err);
            // 409
            case appErrors.EmailTakenError:
            case appErrors.ConflictError:
                return new HttpError(HttpStatusCodes.CONFLICT, err);
            // 422
            case appErrors.ValidationError:
            case appErrors.InvalidPasswordError:
                return new HttpError(HttpStatusCodes.UNPROCESSABLE_ENTITY, err);
            // 500
            default:
                return new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, err);
        }
    }
}

export const httpErrorHandler = new HttpErrorHandler();
