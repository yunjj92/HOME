 import { z } from "zod";
 import { apiErrorSchema } from "./error";

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        apiError: apiErrorSchema.nullable(),
        data: dataSchema,
    });