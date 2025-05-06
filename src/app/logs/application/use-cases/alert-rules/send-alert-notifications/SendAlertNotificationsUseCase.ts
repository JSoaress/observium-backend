import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { INotification } from "@/infra/providers/notification";
import { env } from "@/shared/config/environment";

import { IAlertRuleRepository, ILogRepository, IProjectRepository } from "../../../repos";
import { SendAlertNotificationsGateway, SendAlertNotificationsInput, SendAlertNotificationsOutput } from "./types";

export class SendAlertNotificationsUseCase extends UseCase<SendAlertNotificationsInput, SendAlertNotificationsOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private alertRuleRepository: IAlertRuleRepository;
    private logRepository: ILogRepository;
    private notificationProvider: INotification;

    constructor({ repositoryFactory, notificationProvider }: SendAlertNotificationsGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.alertRuleRepository = repositoryFactory.createAlertRuleRepository();
        this.logRepository = repositoryFactory.createLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.alertRuleRepository, this.logRepository);
        this.notificationProvider = notificationProvider;
    }

    protected impl(): Promise<SendAlertNotificationsOutput> {
        return this.unitOfWork.execute<SendAlertNotificationsOutput>(async () => {
            const alertRules = await this.alertRuleRepository.find({ filter: { active: true } });
            await Promise.all(
                alertRules.map(async (alertRule) => {
                    const { projectId, conditionLevel, conditionCount, conditionWithinMinutes, actionTo } = alertRule;
                    const since = new Date(Date.now() - conditionWithinMinutes * 60_000);
                    const countLogs = await this.logRepository.count({
                        projectId,
                        level: conditionLevel,
                        createdAt: { $gte: since },
                    });
                    if (countLogs >= conditionCount) {
                        const subject = `[${env.platformName}] Alerta: ${conditionLevel} detectado`;
                        const text = `Foram detectados ${countLogs} logs do tipo ${conditionLevel} em ${conditionWithinMinutes} minutos.`;
                        await this.notificationProvider.notify(actionTo, subject, text);
                    }
                })
            );
            return right(undefined);
        });
    }
}
