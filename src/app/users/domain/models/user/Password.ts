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
        return right(new Password(plainPassword));
    }

    static restore(password: string) {
        return new Password(password);
    }

    async verify(plainPassword: string): Promise<boolean> {
        return this.value === plainPassword;
    }

    getValue() {
        return this.value;
    }
}
