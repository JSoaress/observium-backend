import { IRepository } from "@/infra/database";

import { AlertRule, AlertRuleDTO } from "../../domain/models/alert-rule";

export type AlertRuleRepositoryWhere = AlertRuleDTO;

export type IAlertRuleRepository = IRepository<AlertRule, AlertRuleRepositoryWhere>;
