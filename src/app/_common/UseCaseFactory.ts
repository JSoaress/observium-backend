import { IUseCase } from "ts-arch-kit/dist/core/application";

import { IJwt } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";
import { IWebSocket } from "@/infra/socket";

import { AuthenticateUserUseCase } from "../auth/application/use-cases/authenticate-user";
import { AuthenticationDecorator } from "../auth/application/use-cases/authentication-decorator";
import { FetchLogsUseCase } from "../logs/application/use-cases/logs/fetch-logs";
import { GetDailyLogsUseCase } from "../logs/application/use-cases/logs/get-daily-logs";
import { GetHourlyLogsUseCase } from "../logs/application/use-cases/logs/get-hourly-logs";
import { GetLogByIdUseCase } from "../logs/application/use-cases/logs/get-log-by-id";
import { RegisterLogUseCase } from "../logs/application/use-cases/logs/register-log";
import { AddMemberInWorkspaceUseCase } from "../organization/application/use-cases/workspace/add-member-in-workspace";
import { CreateWorkspaceUseCase } from "../organization/application/use-cases/workspace/create-workspace";
import { GetUserMembershipWorkspaceUseCase } from "../organization/application/use-cases/workspace/get-user-membership-workspaces";
import { RemoveWorkspaceMemberUseCase } from "../organization/application/use-cases/workspace/remove-workspace-member";
import { CheckAPIKeyDecorator } from "../projects/application/use-cases/api-keys/check-api-key-decorator";
import { CreateAPIKeyUseCase } from "../projects/application/use-cases/api-keys/create-api-key";
import { FetchAPIKeysUseCase } from "../projects/application/use-cases/api-keys/fetch-api-keys-by-project";
import { FetchAPIKeysByUserUseCase } from "../projects/application/use-cases/api-keys/fetch-api-keys-by-user";
import { CreateProjectUseCase } from "../projects/application/use-cases/projects/create-project";
import { FetchProjectsUseCase } from "../projects/application/use-cases/projects/fetch-projects-by-user";
import { FetchProjectsByWorkspaceUseCase } from "../projects/application/use-cases/projects/fetch-projects-by-workspace";
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkAPIKeyDecorator(useCase: IUseCase<any, any>): IUseCase<any, any> {
        return new CheckAPIKeyDecorator({
            useCase,
            repositoryFactory: this.repositoryFactory,
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

    fetchProjectsByWorkspaceUseCase(): FetchProjectsByWorkspaceUseCase {
        return new FetchProjectsByWorkspaceUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createProjectUseCase(): CreateProjectUseCase {
        return new CreateProjectUseCase({ repositoryFactory: this.repositoryFactory });
    }

    getLogByIdUseCase(): GetLogByIdUseCase {
        return new GetLogByIdUseCase({ repositoryFactory: this.repositoryFactory });
    }

    fetchLogsUseCase(): FetchLogsUseCase {
        return new FetchLogsUseCase({ repositoryFactory: this.repositoryFactory });
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

    fetchAPIKeysByUserUseCase(): FetchAPIKeysByUserUseCase {
        return new FetchAPIKeysByUserUseCase({ repositoryFactory: this.repositoryFactory });
    }

    fetchAPIKeysByProjectUseCase(): FetchAPIKeysUseCase {
        return new FetchAPIKeysUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createAPIKeyUseCase(): CreateAPIKeyUseCase {
        return new CreateAPIKeyUseCase({ repositoryFactory: this.repositoryFactory });
    }

    getUserMembershipWorkspaces(): GetUserMembershipWorkspaceUseCase {
        return new GetUserMembershipWorkspaceUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createWorkspaceUseCase(): CreateWorkspaceUseCase {
        return new CreateWorkspaceUseCase({ repositoryFactory: this.repositoryFactory });
    }

    addWorkspaceMemberUseCase(): AddMemberInWorkspaceUseCase {
        return new AddMemberInWorkspaceUseCase({ repositoryFactory: this.repositoryFactory });
    }

    removeWorkspaceMemberUseCase(): RemoveWorkspaceMemberUseCase {
        return new RemoveWorkspaceMemberUseCase({ repositoryFactory: this.repositoryFactory });
    }
}
