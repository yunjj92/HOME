import type { ZodType } from "zod";
import type { ApiState } from "../types/ApiState";

export function parseToZodSchema<T>(
    apiState: ApiState,
    zodSchema: ZodType<T>,
): ApiState<T> {
    if(apiState.status !== 'success') return apiState;

    const parsedData = zodSchema.safeParse(apiState.data);

    if(!parsedData.success) {
        return {
            status: "error",
            message: parsedData.error.message,
            code: parsedData.error.name,
        };
    }

    return {
        status: "success",
        data: parsedData.data,
    }
}
