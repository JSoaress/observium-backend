import { hash, compare } from "bcrypt";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError } from "@/app/_common/errors";

export class Password {
    private value = "";

    private constructor(value: string) {
        this.value = value;
    }

    static async create(plainPassword: string): Promise<Either<InvalidPasswordError, Password>> {
        if (!plainPassword) return left(new InvalidPasswordError("A senha não foi fornecida."));
        // TODO: validar força da senha
        const hashPassword = await hash(plainPassword, 12);
        return right(new Password(hashPassword));
    }

    static restore(password: string) {
        return new Password(password);
    }

    async verify(plainPassword: string): Promise<boolean> {
        return compare(plainPassword, this.value);
    }

    getValue() {
        return this.value;
    }
}
