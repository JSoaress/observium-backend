import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { ForbiddenError, NotFoundModelError } from "@/app/_common/errors";
import { Log } from "@/app/logs/domain/models/log";
import { IWorkspaceRepository } from "@/app/organization/application/repos";
import { Workspace } from "@/app/organization/domain/models/workspace";
import { IProjectRepository } from "@/app/projects/application/repos";
import { Project } from "@/app/projects/domain/models/project";
import { IWebSocket } from "@/infra/socket";

import { ILogRepository } from "../../../repos";
import { RegisterLogUseCaseGateway, RegisterLogUseCaseInput, RegisterLogUseCaseOutput } from "./types";

export class RegisterLogUseCase extends UseCase<RegisterLogUseCaseInput, RegisterLogUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private workspaceRepository: IWorkspaceRepository;
    private logRepository: ILogRepository;
    private webSocket: IWebSocket;

    constructor({ repositoryFactory, webSocket }: RegisterLogUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.workspaceRepository = repositoryFactory.createWorkspaceRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.logRepository, this.workspaceRepository);
        this.webSocket = webSocket;
    }

    protected impl({ requestUser, projectSlug, ...input }: RegisterLogUseCaseInput): Promise<RegisterLogUseCaseOutput> {
        return this.unitOfWork.execute<RegisterLogUseCaseOutput>(async () => {
            const filter = { slug: projectSlug };
            const project = await this.projectRepository.findOne({ filter });
            if (!project) return left(new NotFoundModelError(Project.name, projectSlug));
            const workspace = (await this.workspaceRepository.findById(project.get("workspaceId"))) as Workspace;
            if (!workspace.userBelongsToWorkspace(requestUser))
                return left(new ForbiddenError(`Você não pode acessar projetos da workspace ${workspace.get("name")}.`));
            if (!workspace.checkUserPermissionInWorkspace(requestUser, "member")) {
                const msg = `Você não pode gravar logs em projetos da workspace ${workspace.get("name")}.`;
                return left(new ForbiddenError(msg));
            }
            const logOrError = Log.create({ ...input, projectId: project.getId() });
            if (logOrError.isLeft()) return left(logOrError.value);
            const newLog = await this.logRepository.save(logOrError.value);
            this.webSocket.send({
                event: "registered-log",
                data: newLog.getSimplified(),
            });
            return right({ logId: newLog.getId() });
        });
    }
}
