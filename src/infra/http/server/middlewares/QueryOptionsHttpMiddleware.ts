import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, parseNumber, right } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions, SortParams } from "ts-arch-kit/dist/database";
import { HttpRequest } from "ts-arch-kit/dist/http/server/http-server";

import { IHttpMiddleware } from "./IHttpMiddleware";

export class QueryOptionsHttpMiddleware implements IHttpMiddleware {
    async execute(req: HttpRequest): Promise<Either<BasicError | Error, HttpRequest>> {
        const { offset, limit: limitStr, sort: sortRaw, ...filter } = req.query || {};
        const skip = parseNumber(offset);
        const limit = parseNumber(limitStr, 30);
        const ordinations = sortRaw ? (sortRaw as string).split(",") : [];
        const sortColumns: SortParams[] = [];
        ordinations.forEach((sort) => {
            const field = sort.trim();
            if (field.startsWith("-")) sortColumns.push({ column: field.slice(1), order: "desc" });
            else sortColumns.push({ column: field, order: "asc" });
        });
        const queryOptions: QueryOptions = { filter, pagination: { limit, skip }, sort: sortColumns };
        return right({ ...req, queryOptions });
    }
}
