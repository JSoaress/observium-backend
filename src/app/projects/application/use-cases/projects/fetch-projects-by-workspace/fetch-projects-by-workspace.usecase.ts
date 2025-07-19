import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { ForbiddenError, NotFoundModelError } from "@/app/_common/errors";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";

import { IProjectRepository } from "../../../repos";
import {
    FetchProjectsByWorkspaceUseCaseGateway,
    FetchProjectsByWorkspaceUseCaseInput,
    FetchProjectsByWorkspaceUseCaseOutput,
} from "./fetch-projects-by-workspace.types";

export class FetchProjectsByWorkspaceUseCase extends UseCase<
    FetchProjectsByWorkspaceUseCaseInput,
    FetchProjectsByWorkspaceUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private projectRepository: IProjectRepository;

    constructor({ repositoryFactory }: FetchProjectsByWorkspaceUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.projectRepository);
    }

    protected async impl(input: FetchProjectsByWorkspaceUseCaseInput): Promise<FetchProjectsByWorkspaceUseCaseOutput> {
        return this.unitOfWork.execute<FetchProjectsByWorkspaceUseCaseOutput>(async () => {
            const { workspace: workspaceId, requestUser, queryOptions = {} } = input;
            const workspace = await this.workspaceRepository.findById(workspaceId);
            if (!workspace) return left(new NotFoundModelError(Workspace.name, workspaceId));
            const belongsToWorkspace = workspace.userBelongsToWorkspace(requestUser);
            if (!belongsToWorkspace)
                return left(new ForbiddenError(`Você não faz parte da workspace ${workspace.get("name")}.`));
            const { filter = {} } = queryOptions;
            filter.workspaceId = workspaceId;
            const count = await this.projectRepository.count(filter);
            const projects = await this.projectRepository.find({ ...queryOptions, filter });
            return right({ count, results: projects });
        });
    }
}
