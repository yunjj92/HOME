import { isAxiosError } from "axios";
import type { ApiState } from "../types/ApiState";
import type { QuerySnapshot } from "../types/QuerySnapshot";

export function resolveQueryState(
    querySnapshot: QuerySnapshot,
): ApiState {
    const { isLoading, error, data } = querySnapshot;

    if(isLoading) {
        return { status: "loading" };
    }

    if(error) {
        const code = isAxiosError(error) ? error.response?.status.toString() ?? "" : "Unknown Error";
        return {
            status: "error",
            message: error.message,
            code: code,
        }
    }

    if(!data) {
        return {
            status: "error",
            message: "API returned empty response.",
            code: ""
        }
    }

    if(!data.success) {
        return {
            status: "error",
            message: data?.apiError?.message ?? "",
            code: "Java Error",
        }
    }

    return {
        status: "success",
        data: data.data
    }
}