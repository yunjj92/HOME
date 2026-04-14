import type { ZodType } from "zod";
import type { ApiQueryResult } from "../types/ApiQueryResult";
import { isAxiosError } from "axios";
import type { ApiResponse } from "../schemas/common/api";

type ApiQuerySource<T> = {
    data?: {
        data: ApiResponse<T>;
    };
    isLoading: boolean;
    error: unknown;
};

export function handleApiQuery<T>(
    apiHookResult: ApiQuerySource<T>,
    schema: ZodType<any>): ApiQueryResult<T> {

    // API 통신 결과 수신
    const { data, isLoading, error } = apiHookResult;

    if(isLoading) {
        return { status: "loading" };
    };

    if(error) {
        if(isAxiosError(error)) {
            return {
                status: "error",
                message: error.message,
                code: error.response?.status.toString() ?? "",
            };
        }

        return {
            status: "error",
            message: "Unknown Error",
            code: "Unknow Error",
        };
    }

    // zod 스키마로 데이터 변환
    const parsedData = schema.safeParse(data?.data);

    if(!parsedData.success) {
        return {
            status: "error",
            message: parsedData.error.message,
            code: "Parsed data error.",
        };
    }

    // 백엔드 송신 데이터 확인
    const realData = parsedData.data;

    if(!realData.success) {
        return {
            status: "error",
            message: realData.apiError.message,
            code: "Api error."
        };
    }

    return {
        status: "success",
        data: realData.data,
    }
}