import { AbstractModel, AbstractModelProps } from "ts-arch-kit/dist/core/models";

export abstract class Model<T extends AbstractModelProps> extends AbstractModel<T> {
    protected constructor(props: T) {
        super(props, !props.id);
    }

    getId(): string {
        return `${this.id}`;
    }
}
