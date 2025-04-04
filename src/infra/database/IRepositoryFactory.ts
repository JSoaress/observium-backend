import { UnitOfWork } from "ts-arch-kit/dist/database";

import { ILogRepository, IProjectRepository } from "@/app/logs/application/repos";
import { IAPIKeyRepository, IUserRepository, IUserTokenRepository } from "@/app/users/application/repos";

export interface IRepositoryFactory {
    createUnitOfWork(): UnitOfWork;
    createUserRepository(): IUserRepository;
    createUserTokenRepository(): IUserTokenRepository;
    createAPIKeyRepository(): IAPIKeyRepository;
    createProjectRepository(): IProjectRepository;
    createLogRepository(): ILogRepository;
}
