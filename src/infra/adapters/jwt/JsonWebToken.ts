import { sign, verify } from "jsonwebtoken";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidTokenError } from "@/app/_common/errors";

import { IJwt } from "./IJwt";

type Payload = {
    sub: string;
};

export class JsonWebToken implements IJwt {
    generate(payload: string, secret: string, expiresIn?: number): string {
        if (expiresIn) return sign({}, secret, { subject: payload, expiresIn });
        return sign({}, secret, { subject: payload });
    }

    verify(token: string, secret: string): Either<InvalidTokenError, string> {
        try {
            if (!token) return left(new InvalidTokenError("Token não fornecido."));
            const { sub } = verify(token, secret) as Payload;
            return right(sub);
        } catch (error) {
            return left(new InvalidTokenError());
        }
    }
}
