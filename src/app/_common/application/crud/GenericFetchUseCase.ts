import { FetchUseCase } from "ts-arch-kit/dist/core/application/crud";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions, UnitOfWork } from "ts-arch-kit/dist/database";

import { IRepository, IRepositoryFactory } from "@/infra/database";

import { Pagination } from "../..";
import { UnknownError } from "../../errors";
import { Model } from "../../Model";

export type GenericFetchOutput<T> = Either<UnknownError, Pagination<T>>;

export abstract class GenericFetchUseCase<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TModel extends Model<any>,
    TInput extends { queryOptions?: QueryOptions },
    TFetchResult = TModel
> extends FetchUseCase<TModel, TInput, GenericFetchOutput<TModel | TFetchResult>, TFetchResult> {
    protected unitOfWork: UnitOfWork;
    protected repository: IRepository<TModel>;

    constructor(protected repositoryFactory: IRepositoryFactory, createRepository: () => IRepository<TModel>) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.repository = createRepository();
        this.unitOfWork.prepare(this.repository);
    }

    async fetch(input: TInput): Promise<GenericFetchOutput<TModel | TFetchResult>> {
        try {
            return this.unitOfWork.execute<GenericFetchOutput<TModel | TFetchResult>>(async () => {
                const queryOptions = this.queryOptions(input);
                const count = await this.repository.count(queryOptions?.filter);
                const models = await this.repository.find(queryOptions);
                const results = await this.processBeforeReturn(models);
                return right({ count, results });
            });
        } catch (error) {
            if (error instanceof BasicError) return left(error);
            return left(new UnknownError(error));
        }
    }

    protected queryOptions(input: TInput): QueryOptions | undefined {
        return input.queryOptions;
    }

    protected async processBeforeReturn(records: TModel[]): Promise<TModel[] | TFetchResult[]> {
        return records;
    }
}
