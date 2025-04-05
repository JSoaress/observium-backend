/* eslint-disable @typescript-eslint/naming-convention */
import { QueryOptions } from "ts-arch-kit/dist/database";
import { HttpRequest as HttpRequestBase } from "ts-arch-kit/dist/http/server";

declare module "ts-arch-kit/dist/http/server" {
    export interface HttpRequest extends HttpRequestBase {
        requestUserToken: string;
        queryOptions?: QueryOptions;
    }
}
