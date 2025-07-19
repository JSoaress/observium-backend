import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { AddMembershipInWorkspaceError, RemoveMembershipInWorkspaceError, ValidationError } from "@/app/_common/errors";
import { User } from "@/app/users/domain/models/user";
import { ZodValidator } from "@/infra/libs/zod";
import { UUID } from "@/shared/helpers";

import { CreateWorkspaceMembershipDTO, WorkspaceMembershipDTO, WorkspaceMembershipSchema } from "./workspace-membership.dto";
import {
    AddMembershipInWorkspace,
    CreateWorkspaceDTO,
    RestoreWorkspaceDTO,
    WorkspaceDTO,
    WorkspaceSchema,
} from "./workspace.dto";

export class Workspace extends Model<WorkspaceDTO> {
    private members: WorkspaceMembershipDTO[] = [];

    constructor(props: WorkspaceDTO, members: WorkspaceMembershipDTO[]) {
        super(props);
        this.members = members;
    }

    static create(props: CreateWorkspaceDTO): Either<ValidationError | AddMembershipInWorkspaceError, Workspace> {
        const validDataOrError = ZodValidator.validate({ ...props, ownerId: props.owner.getId() }, WorkspaceSchema);
        if (!validDataOrError.success) return left(new ValidationError(Workspace.name, validDataOrError.errors));
        const workspace = new Workspace(validDataOrError.data, []);
        const addMemberOrError = workspace.addMember({ userId: props.owner.getId(), role: "admin" }, props.owner);
        if (addMemberOrError.isLeft()) return left(addMemberOrError.value);
        return right(workspace);
    }

    static restore({ members, ...props }: RestoreWorkspaceDTO) {
        return new Workspace(props, members);
    }

    addMember(
        props: AddMembershipInWorkspace,
        grantor: User
    ): Either<AddMembershipInWorkspaceError | ValidationError, WorkspaceMembershipDTO> {
        const grantorIsOwner = grantor.getId() === this.get("ownerId");
        if (!this.members.some((m) => m.userId === grantor.getId()) && !grantorIsOwner)
            return left(new AddMembershipInWorkspaceError(this, "O usuário concedente não participa da workspace."));
        if (!this.members.some((m) => m.userId === grantor.getId() && m.role === "admin") && !grantorIsOwner) {
            const reason = "O usuário concedente não tem permissão para adicionar novos membros.";
            return left(new AddMembershipInWorkspaceError(this, reason));
        }
        if (this.members.some((member) => member.userId === props.userId))
            return left(new AddMembershipInWorkspaceError(this, "O usuário já faz parte da workspace."));
        const input: CreateWorkspaceMembershipDTO = { ...props, workspaceId: this.getId() };
        const memberOrError = ZodValidator.validate(input, WorkspaceMembershipSchema);
        if (!memberOrError.success) return left(new ValidationError("WorkspaceMembership", memberOrError.errors));
        const newMember: WorkspaceMembershipDTO = { ...memberOrError.data, id: UUID.v7() };
        this.members.push(newMember);
        return right(newMember);
    }

    removeMember(memberId: string, executor: User): Either<RemoveMembershipInWorkspaceError, void> {
        const memberIndex = this.members.findIndex((m) => m.id === memberId || m.userId === memberId);
        if (memberIndex < 0) return left(new RemoveMembershipInWorkspaceError(this, "O usuário não pertence à workspace."));
        if (this.members[memberIndex].userId === executor.getId()) this.members.splice(memberIndex, 1);
        const executorIsOwner = executor.getId() === this.get("ownerId");
        if (!this.members.some((m) => m.userId === executor.getId()) && !executorIsOwner)
            return left(new RemoveMembershipInWorkspaceError(this, "O usuário executor não participa da workspace."));
        if (!this.members.some((m) => m.userId === executor.getId() && m.role === "admin") && !executorIsOwner) {
            const reason = "O usuário executor não tem permissão para adicionar novos membros.";
            return left(new RemoveMembershipInWorkspaceError(this, reason));
        }
        this.members.splice(memberIndex, 1);
        return right(undefined);
    }

    getMembers() {
        return [...this.members];
    }
}
