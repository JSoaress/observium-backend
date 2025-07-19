import { IRepository } from "@/infra/database";

import { ProjectDTO, Project } from "../../domain/models/project";

export type ProjectRepositoryWhere = ProjectDTO;

export type IProjectRepository = IRepository<Project, ProjectRepositoryWhere>;
