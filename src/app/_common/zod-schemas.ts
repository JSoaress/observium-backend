import { z } from "@/infra/libs/zod";

export const EntityIdSchema = z
    .string({ coerce: true })
    .uuid("Esse campo precisa ser um UUID v7.")
    .refine(
        (uuid) => {
            const [, , part] = uuid.split("-");
            return part[0] === "7";
        },
        {
            message: "Esse campo precisa ser um UUID v7.",
        }
    );
