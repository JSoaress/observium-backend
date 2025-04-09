import { IUseCase } from "ts-arch-kit/dist/core/application";

import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";
import { IWebSocket } from "@/infra/socket";

import { AuthenticateUserUseCase } from "../auth/application/use-cases/authenticate-user";
import { AuthenticationDecorator } from "../auth/application/use-cases/authentication-decorator";
import { GetDailyLogsUseCase } from "../logs/application/use-cases/logs/get-daily-logs";
import { GetHourlyLogsUseCase } from "../logs/application/use-cases/logs/get-hourly-logs";
import { GetLogByIdUseCase } from "../logs/application/use-cases/logs/get-log-by-id";
import { RegisterLogUseCase } from "../logs/application/use-cases/logs/register-log";
import { CreateProjectUseCase } from "../logs/application/use-cases/projects/create-project";
import { FetchProjectsUseCase } from "../logs/application/use-cases/projects/fetch-projects";
import { CreateAPIKeyUseCase } from "../users/application/use-cases/api-keys/create-api-key";
import { FetchAPIKeysUseCase } from "../users/application/use-cases/api-keys/fetch-api-keys";
import { ActivateUserUseCase } from "../users/application/use-cases/users/activate-user";
import { CreateUserUseCase } from "../users/application/use-cases/users/create-user";

export class UseCaseFactory {
    constructor(
        private repositoryFactory: IRepositoryFactory,
        private mailProvider: IMail,
        private jwtAdapter: IJwt,
        private webSocket: IWebSocket
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticationDecorator(useCase: IUseCase<any, any>): IUseCase<any, any> {
        return new AuthenticationDecorator({
            useCase,
            repositoryFactory: this.repositoryFactory,
            jwtAdapter: this.jwtAdapter,
        });
    }

    createUserUseCase(): CreateUserUseCase {
        return new CreateUserUseCase({ repositoryFactory: this.repositoryFactory, mailProvider: this.mailProvider });
    }

    activateUserUseCase(): ActivateUserUseCase {
        return new ActivateUserUseCase({ repositoryFactory: this.repositoryFactory });
    }

    authenticateUserUseCase(): AuthenticateUserUseCase {
        return new AuthenticateUserUseCase({ repositoryFactory: this.repositoryFactory, jwtAdapter: this.jwtAdapter });
    }

    fetchProjectsUseCase(): FetchProjectsUseCase {
        return new FetchProjectsUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createProjectUseCase(): CreateProjectUseCase {
        return new CreateProjectUseCase({ repositoryFactory: this.repositoryFactory });
    }

    getLogByIdUseCase(): GetLogByIdUseCase {
        return new GetLogByIdUseCase({ repositoryFactory: this.repositoryFactory });
    }

    registerLogUseCase(): RegisterLogUseCase {
        return new RegisterLogUseCase({ repositoryFactory: this.repositoryFactory, webSocket: this.webSocket });
    }

    getDailyLogsUseCase(): GetDailyLogsUseCase {
        return new GetDailyLogsUseCase({ repositoryFactory: this.repositoryFactory });
    }

    getHourlyLogsUseCase(): GetHourlyLogsUseCase {
        return new GetHourlyLogsUseCase({ repositoryFactory: this.repositoryFactory });
    }

    fetchAPIKeysUseCase(): FetchAPIKeysUseCase {
        return new FetchAPIKeysUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createAPIKeyUseCase(): CreateAPIKeyUseCase {
        return new CreateAPIKeyUseCase({ repositoryFactory: this.repositoryFactory });
    }
}
