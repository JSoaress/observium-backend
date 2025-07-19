import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { NotFoundModelError } from "@/app/_common/errors";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { IUserRepository } from "@/app/users/application/repos";
import { User } from "@/app/users/domain/models/user";

import { IWorkspaceRepository } from "../../../repos";
import {
    AddMemberInWorkspaceUseCaseGateway,
    AddMemberInWorkspaceUseCaseInput,
    AddMemberInWorkspaceUseCaseOutput,
} from "./add-member-in-workspace.types";

export class AddMemberInWorkspaceUseCase extends UseCase<
    AddMemberInWorkspaceUseCaseInput,
    AddMemberInWorkspaceUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: AddMemberInWorkspaceUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.userRepository);
    }

    protected async impl(input: AddMemberInWorkspaceUseCaseInput): Promise<AddMemberInWorkspaceUseCaseOutput> {
        return this.unitOfWork.execute<AddMemberInWorkspaceUseCaseOutput>(async () => {
            const { workspace: workspaceId, userId, role, requestUser } = input;
            const workspace = await this.workspaceRepository.findById(workspaceId);
            if (!workspace) return left(new NotFoundModelError(Workspace.name, workspaceId));
            const userExists = await this.userRepository.exists({ id: userId });
            if (!userExists) return left(new NotFoundModelError(User.name, userId));
            const addMemberOrError = workspace.addMember({ userId, role }, requestUser);
            if (addMemberOrError.isLeft()) return left(addMemberOrError.value);
            await this.workspaceRepository.save(workspace);
            return right(undefined);
        });
    }
}
