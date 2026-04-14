import type { ZodType } from "zod";
import type { ApiQueryResult } from "../types/ApiQueryResult";
import { isAxiosError } from "axios";
import type { ApiResponse } from "../schemas/common/api";

/**
 * Option B: Pure processor for API responses.
 * It now takes individual pieces of state instead of a hook result object.
 */
export function handleApiQuery<T>(
    rawData: ApiResponse<T> | undefined | null,
    isLoading: boolean,
    error: unknown,
    schema: ZodType<unknown>
): ApiQueryResult<T> {

    if (isLoading) {
        return { status: "loading" };
    }

    if (rawData === null) {
        return {
            status: "error",
            message: "API returned null data.",
            code: "Data is null.",
        };
    }

    if (error) {
        if (isAxiosError(error)) {
            return {
                status: "error",
                message: error.message,
                code: error.response?.status.toString() ?? "",
            };
        }

        return {
            status: "error",
            message: "Unknown Error",
            code: "Unknown Error",
        };
    }

    // [Check for rawData presence]
    // If it's a mutation that hasn't run, data might be undefined even if not loading
    if (!rawData) {
        return { status: "loading" };
    }

    // Zod parsing
     const parsedData = schema.safeParse(rawData);

     // eslint-disable-next-line no-console
     console.log("Parsed data:", parsedData.success ===true);
    if (!parsedData.success) {
        return {
            status: "error",
            message: parsedData.error.message,
            code: "Parsed data error.",
        };
    }

    return {
        status: "success",
        data: parsedData.data as T,
    };
}
