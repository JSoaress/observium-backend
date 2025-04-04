import { AbstractModel, AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { UUID } from "@/shared/helpers";

export abstract class Model<T extends AbstractModelProps> extends AbstractModel<T> {
    protected constructor(props: T) {
        super(props, !props.id, UUID.v7);
    }

    getId(): string {
        return `${this.id}`;
    }
}
