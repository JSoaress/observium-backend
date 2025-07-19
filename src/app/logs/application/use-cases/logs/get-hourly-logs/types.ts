import { Either } from "ts-arch-kit/dist/core/helpers";

import { ForbiddenError, MissingParamError, NotFoundModelError } from "@/app/_common/errors";
import { TotalDailyLogs } from "@/app/logs/domain/models/log";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetHourlyLogsUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetHourlyLogsUseCaseInput = {
    projectIdOrSlug: string;
    requestUser: User;
};

export type GetHourlyLogsUseCaseOutput = Either<MissingParamError | NotFoundModelError | ForbiddenError, TotalDailyLogs[]>;
