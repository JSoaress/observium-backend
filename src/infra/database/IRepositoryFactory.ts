import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IUserRepository, IUserTokenRepository } from "@/app/users/application/repos";

export interface IRepositoryFactory {
    createUnitOfWork(): UnitOfWork;
    createUserRepository(): IUserRepository;
    createUserTokenRepository(): IUserTokenRepository;
}
