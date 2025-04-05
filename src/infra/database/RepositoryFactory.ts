import { MissingDependencyError } from "../errors";
import { IRepositoryFactory } from "./IRepositoryFactory";
import { KnexRepositoryFactory } from "./knex/KnexRepositoryFactory";

export class RepositoryFactory {
    static getRepository(provider: string): IRepositoryFactory {
        switch (provider) {
            case "knex":
                return new KnexRepositoryFactory();
            default:
                throw new MissingDependencyError("IRepositoryFactory");
        }
    }
}
