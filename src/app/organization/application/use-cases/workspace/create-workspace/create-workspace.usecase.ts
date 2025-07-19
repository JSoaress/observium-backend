import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { Workspace } from "@/app/organization/domain/models/workspace";

import { IWorkspaceRepository } from "../../../repos";
import {
    CreateWorkspaceUseCaseGateway,
    CreateWorkspaceUseCaseInput,
    CreateWorkspaceUseCaseOutput,
} from "./create-workspace.types";

export class CreateWorkspaceUseCase extends UseCase<CreateWorkspaceUseCaseInput, CreateWorkspaceUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;

    constructor({ repositoryFactory }: CreateWorkspaceUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.unitOfWork.prepare(this.workspaceRepository);
    }

    protected async impl({ requestUser, ...input }: CreateWorkspaceUseCaseInput): Promise<CreateWorkspaceUseCaseOutput> {
        return this.unitOfWork.execute<CreateWorkspaceUseCaseOutput>(async () => {
            const workspaceOrError = Workspace.create({ ...input, owner: requestUser });
            if (workspaceOrError.isLeft()) return left(workspaceOrError.value);
            const newWorkspace = await this.workspaceRepository.save(workspaceOrError.value);
            return right(newWorkspace);
        });
    }
}
