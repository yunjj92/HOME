import { z } from "zod";

export const apiErrorSchema = z.object({
    message: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
    return z.object({
        success: z.boolean(),
        apiError: apiErrorSchema.nullable(),
        data: dataSchema,
    });
}

export type ApiResponse<T> = {
    success: boolean;
    apiError: ApiError | null;
    data: T;
};