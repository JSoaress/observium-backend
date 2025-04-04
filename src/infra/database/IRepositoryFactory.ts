import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IAPIKeyRepository, IUserRepository, IUserTokenRepository } from "@/app/users/application/repos";

export interface IRepositoryFactory {
    createUnitOfWork(): UnitOfWork;
    createUserRepository(): IUserRepository;
    createUserTokenRepository(): IUserTokenRepository;
    createAPIKeyRepository(): IAPIKeyRepository;
}
