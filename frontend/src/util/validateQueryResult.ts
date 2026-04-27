import type { ZodType } from "zod";
import type { ApiState } from "../types/ApiState";
import { isAxiosError } from "axios";
import type { ApiResponse } from "../schemas/common/api";
import type { QuerySnapshot } from "../types/QuerySnapshot";

export function validateQueryResult<TData>(
    queryResult: QuerySnapshot<TData, Error>,
    zodSchema: ZodType<ApiResponse<TData>>,
): ApiState<TData> {

    // API 조회 결과 수신
    const { isLoading, error, data } = queryResult;

    if (isLoading) {
        return { status: "loading" };
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
            message: error.message,
            code: "Unknown Error",
        };
    }

    if (data === null) {
        return {
            status: "error",
            message: "API returned null data.",
            code: "Data is null.",
        };
    }

    // Zod parsing
     const parsedData = zodSchema.safeParse(data);

    if (!parsedData.success) {
        return {
            status: "error",
            message: parsedData.error.message,
            code: "Parsed data error.",
        };
    }

    // Java error check
    const apiReponse = parsedData.data;

    if(!apiReponse.success) {
        return {
            status: "error",
            message: apiReponse.apiError?.message ?? "",
            code: "Api error."
        }
    }

    return {
        status: "success",
        data: apiReponse.data,
    };
}
