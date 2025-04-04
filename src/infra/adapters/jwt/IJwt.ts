import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidTokenError } from "@/app/_common/errors";

export interface IJwt {
    generate(payload: string | number, secret: string, expiresIn?: string | number): string;
    verify(token: string, secret: string): Either<InvalidTokenError, string>;
}
