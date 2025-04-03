import { z, ZodType } from "zod";

type SuccessResult<T> = {
    success: true;
    data: T;
};

type ErrorResult = {
    success: false;
    errors: Record<string, string[]>;
};

type ResultValidate<T> = SuccessResult<T> | ErrorResult;

export class ZodValidator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static validate<I, O>(props: unknown, schema: ZodType<O, any, I>): ResultValidate<O> {
        const result = schema.safeParse(props);
        if (result.success) return { success: true, data: result.data };
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            if (errors[path]) errors[path].push(issue.message);
            else errors[path] = [issue.message];
        });
        return { success: false, errors };
    }
}

export { z };
