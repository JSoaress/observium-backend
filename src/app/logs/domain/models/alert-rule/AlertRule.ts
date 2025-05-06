import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { AlertRuleDTO, AlertRuleSchema, CreateAlertRuleDTO, RestoreAlertRuleDTO } from "./AlertRuleDTO";

export class AlertRule extends Model<AlertRuleDTO> {
    private constructor(props: AlertRuleDTO) {
        super(props);
    }

    static create(props: CreateAlertRuleDTO): Either<ValidationError, AlertRule> {
        const validDataOrError = ZodValidator.validate({ ...props, createdAt: new Date() }, AlertRuleSchema);
        if (!validDataOrError.success) return left(new ValidationError(AlertRule.name, validDataOrError.errors));
        return right(new AlertRule(validDataOrError.data));
    }

    static restore(props: RestoreAlertRuleDTO) {
        return new AlertRule(props);
    }

    get description() {
        return this.props.description;
    }

    get projectId() {
        return this.props.projectId;
    }

    get conditionLevel() {
        return this.props.condition.level;
    }

    get conditionCount() {
        return this.props.condition.count;
    }

    get conditionWithinMinutes() {
        return this.props.condition.withinMinutes;
    }

    get actionType() {
        return this.props.action.type;
    }

    get actionTo() {
        return this.props.action.to;
    }

    get active() {
        return this.props.active;
    }
}
