import { IRepository } from "@/infra/database";

import { UserToken, UserTokenDTO } from "../../domain/models/user";

export type UserTokenRepositoryWhere = UserTokenDTO;

export type IUserTokenRepository = IRepository<UserToken, UserTokenRepositoryWhere>;
