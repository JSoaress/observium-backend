import { BasicError } from "ts-arch-kit/dist/core/errors";

export class MissingDependencyError extends BasicError {
    constructor(service: string) {
        super(`Nenhum serviço do tipo "${service}" foi configurado.`, false);
    }
}
