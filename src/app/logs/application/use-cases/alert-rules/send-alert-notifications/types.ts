import { Either } from "ts-arch-kit/dist/core/helpers";

import { UnknownError } from "@/app/_common/errors";
import { IRepositoryFactory } from "@/infra/database";
import { INotification } from "@/infra/providers/notification";

export type SendAlertNotificationsGateway = {
    repositoryFactory: IRepositoryFactory;
    notificationProvider: INotification;
};

export type SendAlertNotificationsInput = void;

export type SendAlertNotificationsOutput = Either<UnknownError, void>;
