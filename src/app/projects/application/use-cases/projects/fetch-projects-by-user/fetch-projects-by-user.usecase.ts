import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { IWorkspaceRepository } from "@/app/organization/application/repos";

import { IProjectRepository } from "../../../repos";
import {
    FetchProjectsUseCaseGateway,
    FetchProjectsUseCaseInput,
    FetchProjectsUseCaseOutput,
} from "./fetch-projects-by-user.types";

export class FetchProjectsUseCase extends UseCase<FetchProjectsUseCaseInput, FetchProjectsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;

    constructor({ repositoryFactory }: FetchProjectsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository);
    }

    protected async impl({ requestUser, queryOptions }: FetchProjectsUseCaseInput): Promise<FetchProjectsUseCaseOutput> {
        return this.unitOfWork.execute<FetchProjectsUseCaseOutput>(async () => {
            const workspaces = await this.workspaceRepository.getByUser(requestUser);
            const workspaceIds = workspaces.map((workspace) => workspace.getId());
            const { filter = {} } = queryOptions || {};
            filter.workspaceId = { $in: workspaceIds };
            const count = await this.projectRepository.count(filter);
            const projects = await this.projectRepository.find({ ...queryOptions, filter });
            return right({ count, results: projects });
        });
    }
}
