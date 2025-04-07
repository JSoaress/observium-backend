export * from "./Model";
export * from "./UseCase";
export * from "./zod-schemas";
export * from "./UseCaseFactory";

export type Pagination<P> = {
    count: number;
    results: P[];
};
