import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { UnknownError } from "@/app/_common/errors";
import { Project } from "@/app/projects/domain/models/project";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type FetchProjectsUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchProjectsUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: User;
};

export type FetchProjectsUseCaseOutput = Either<UnknownError, Pagination<Project>>;
