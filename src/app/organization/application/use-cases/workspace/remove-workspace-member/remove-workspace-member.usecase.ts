import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { NotFoundModelError } from "@/app/_common/errors";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { IUserRepository } from "@/app/users/application/repos";
import { User } from "@/app/users/domain/models/user";

import { IWorkspaceRepository } from "../../../repos";
import {
    RemoveWorkspaceMemberUseCaseGateway,
    RemoveWorkspaceMemberUseCaseInput,
    RemoveWorkspaceMemberUseCaseOutput,
} from "./remove-workspace-member.types";

export class RemoveWorkspaceMemberUseCase extends UseCase<
    RemoveWorkspaceMemberUseCaseInput,
    RemoveWorkspaceMemberUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: RemoveWorkspaceMemberUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.workspaceRepository, this.userRepository);
    }

    protected async impl(input: RemoveWorkspaceMemberUseCaseInput): Promise<RemoveWorkspaceMemberUseCaseOutput> {
        return this.unitOfWork.execute<RemoveWorkspaceMemberUseCaseOutput>(async () => {
            const { workspace: workspaceId, member, requestUser } = input;
            const workspace = await this.workspaceRepository.findById(workspaceId);
            if (!workspace) return left(new NotFoundModelError(Workspace.name, workspaceId));
            const userExists = await this.userRepository.exists({ id: member });
            if (!userExists) return left(new NotFoundModelError(User.name, member));
            const removeMemberOrError = workspace.removeMember(member, requestUser);
            if (removeMemberOrError.isLeft()) return left(removeMemberOrError.value);
            await this.workspaceRepository.save(workspace);
            return right(undefined);
        });
    }
}
