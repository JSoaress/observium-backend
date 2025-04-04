export * from "./Model";
export * from "./UseCase";
export * from "./zod-schemas";

export type Pagination<P> = {
    count: number;
    results: P[];
};
