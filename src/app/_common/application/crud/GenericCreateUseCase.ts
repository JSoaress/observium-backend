/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { CreateUseCase } from "ts-arch-kit/dist/core/application/crud";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IRepository, IRepositoryFactory } from "@/infra/database";

import { UnknownError } from "../../errors";
import { Model } from "../../Model";

type Output<T, E extends BasicError = BasicError> = Either<E, T>;

export class GenericCreateUseCase<TModel extends Model<any>, TInput> extends CreateUseCase<
    TModel,
    TInput,
    Output<TModel>,
    Output<TModel>,
    Output<TModel>
> {
    protected unitOfWork: UnitOfWork;
    protected repository: IRepository<TModel>;

    constructor(
        protected clazz: Function,
        protected repositoryFactory: IRepositoryFactory,
        createRepository: () => IRepository<TModel>
    ) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.repository = createRepository();
        this.unitOfWork.prepare(this.repository);
    }

    async create(input: TInput): Promise<Output<TModel, BasicError>> {
        try {
            return this.unitOfWork.execute<Output<TModel>>(async () => {
                const modelOrError = await this.validateCreate(input);
                if (modelOrError.isLeft()) return left(modelOrError.value);
                const preCreateOrError = await this.beforeCreate(modelOrError.value);
                if (preCreateOrError.isLeft()) return left(preCreateOrError.value);
                const newModel = await this.repository.save(preCreateOrError.value);
                return right(newModel);
            });
        } catch (error) {
            if (error instanceof BasicError) return left(error);
            return left(new UnknownError(error));
        }
    }

    protected async validateCreate(input: TInput): Promise<Output<TModel, BasicError>> {
        return this.clazz.create(input);
    }

    protected async beforeCreate(validatedModel: TModel): Promise<Output<TModel, BasicError>> {
        return right(validatedModel);
    }
}
