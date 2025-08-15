import { AbstractModel, AbstractModelProps, PrimaryKey } from "ts-arch-kit/dist/core/models";

import { UUID } from "@/shared/helpers";

export abstract class Model<T extends AbstractModelProps> extends AbstractModel<T> {
    protected constructor(props: T, idGenerator: () => PrimaryKey = UUID.v7) {
        super(props, !props.id, idGenerator);
    }

    getId(): string {
        return `${this.id}`;
    }
}
