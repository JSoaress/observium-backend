/* eslint-disable max-classes-per-file */
import { BasicError } from "ts-arch-kit/dist/core/errors";

export class ValidationError extends BasicError {
    constructor(model: string, private errors: Record<string, string[]>) {
        super(`Erro de validação em "${model}"`, true);
    }

    getError(prop: string): string[] | null {
        return this.errors[prop] || null;
    }

    getErrors() {
        return this.errors;
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            errors: this.errors,
        };
    }
}

export class InvalidPasswordError extends BasicError {
    constructor(message: string) {
        super(message, true);
    }
}

export class PasswordDoNotMatchError extends BasicError {
    constructor() {
        super("As senhas não conferem.", true);
    }
}

export class UnknownError extends BasicError {
    constructor(error: unknown) {
        const message = ["Erro desconhecido."];
        let isOperational = true;
        if (error instanceof Error) {
            isOperational = false;
            message.push("MOTIVO:", error.message);
        }
        super(message.join(" "), isOperational);
    }
}

export class NotFoundModelError extends BasicError {
    constructor(model: string, readonly pk: unknown) {
        super(`O objeto do tipo "${model}" não foi encontrado.`, true);
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            pk: this.pk,
        };
    }
}

export class MissingParamError extends BasicError {
    constructor(param: string, scope: "path" | "body" | "query" = "path") {
        super(
            `O parâmetro '${param}' não foi encontrado. Certifique-se de incluir o parâmetro na seção '${scope}' para prosseguir com a requisição.`,
            true
        );
    }
}
