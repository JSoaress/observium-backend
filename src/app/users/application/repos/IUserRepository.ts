import { IRepository } from "@/infra/database";

import { User, UserDTO } from "../../domain/models/user";

export type UserRepositoryWhere = Omit<UserDTO, "password">;

export type IUserRepository = IRepository<User, UserRepositoryWhere>;
