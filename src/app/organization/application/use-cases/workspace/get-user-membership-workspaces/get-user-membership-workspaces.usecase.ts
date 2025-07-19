import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";

import { IWorkspaceRepository } from "../../../repos";
import {
    GetUserMembershipWorkspaceUseCaseGateway,
    GetUserMembershipWorkspaceUseCaseInput,
    GetUserMembershipWorkspaceUseCaseOutput,
} from "./get-user-membership-workspaces.types";

export class GetUserMembershipWorkspaceUseCase extends UseCase<
    GetUserMembershipWorkspaceUseCaseInput,
    GetUserMembershipWorkspaceUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private workspaceRepository: IWorkspaceRepository;

    constructor({ repositoryFactory }: GetUserMembershipWorkspaceUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.unitOfWork.prepare(this.workspaceRepository);
    }

    protected async impl(input: GetUserMembershipWorkspaceUseCaseInput): Promise<GetUserMembershipWorkspaceUseCaseOutput> {
        return this.unitOfWork.execute<GetUserMembershipWorkspaceUseCaseOutput>(async () => {
            const workspaces = await this.workspaceRepository.getByUser(input.requestUser, input.queryOptions);
            return right({ count: workspaces.length, results: workspaces });
        });
    }
}
