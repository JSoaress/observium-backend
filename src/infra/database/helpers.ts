import { AbstractModelProps } from "ts-arch-kit/dist/core/models";
import { ISetUnitOfWork, IRepository as IBaseRepository } from "ts-arch-kit/dist/database";

export interface IRepository<T extends AbstractModelProps, W = Record<string, unknown>>
    extends ISetUnitOfWork,
        IBaseRepository<T, W> {}
