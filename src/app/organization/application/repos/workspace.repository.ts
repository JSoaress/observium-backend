import { QueryOptions } from "ts-arch-kit/dist/database";

import { User } from "@/app/users/domain/models/user";
import { IRepository } from "@/infra/database";

import { Workspace, WorkspaceDTO } from "../../domain/models/workspace";

export type WorkspaceRepositoryWhere = WorkspaceDTO;

export interface IWorkspaceRepository extends IRepository<Workspace, WorkspaceRepositoryWhere> {
    getByUser(user: User, queryOptions?: QueryOptions): Promise<Workspace[]>;
}
