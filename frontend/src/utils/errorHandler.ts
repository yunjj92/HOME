import { AxiosError, isAxiosError } from "axios";
import { ERROR_MESSAGES, ERROR_STATUS } from "./errorConstants";
import type { ApiError } from "../api/model";
import { ZodError } from "zod";

export type AppErrorType =
    | "network"     // 서버와 통신 자체가 안됨, 서버 꺼짐 등
    | "http"        // HTTP status 에러, 400 404 등
    | "server"      // 서버 내부 에러, 500 등
    | "domain"      // 비즈니스 로직 에러
    | "validation"  // 발리데이션 체크 에러
    | "auth"        // 세션 만료, 인증 실패 등
    | "client"      // 프론트 런타임 또는 라이브러리 에러
    | "unknown";    // 기타 에러

export type AppError = {
    type: AppErrorType;     // 에러 종류
    status?: number;        // HTTP status 400 등
    code?: string;          // Axios나 브라우저, 서버의 에러 코드
    source?: string;        // 에러발생 도메인
    cause?: unknown;        // 원본 에러 객체
    message: string;        // 에러로그 원본 메시지
    userMessage: string;    // 사용자에게 표시할 에러 메시지
};

// ApiResponse 래퍼
type ApiResponseLike = {
    success?: boolean;
    apiError?: ApiError | null;
    data?: unknown;
};

// collect시, 커스텀으로 지정할 수 있는 변수의 타입
type ErrorHandlerOptions = {
    source?: string;
    fallbackMessage?: string;
};

// 에러표시 함수 타입
type ErrorDisplay = (errors: AppError[]) => void;

// useQuery의 result를 파라미터로 받는 타입
type ErrorCheckTarget = {
    error?: unknown;
    data?: ApiResponseLike;
};

// 객체검증
const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

// ApiResponse 검증
const isApiResponseLike = (value: unknown): value is ApiResponseLike => {
    if (!isRecord(value)) return false;
    return "success" in value && "apiError" in value && "data" in value;
};

// 기본 에러 메시지
const DEFAULT_USER_MESSAGE = "An error occurred while processing the request.";

// 에러 STATUS별 메시지 
const STATUS_MESSAGES: Partial<Record<number, string>> = {
    [ERROR_STATUS.BAD_REQUEST]: "The request is invalid.",
    [ERROR_STATUS.UNAUTHORIZED]: "Login is required or the session has expired.",
    [ERROR_STATUS.FORBIDDEN]: "You do not have permission to perform this action.",
    [ERROR_STATUS.NOT_FOUND]: "The requested data could not be found.",
    [ERROR_STATUS.INTERNAL_SERVER_ERROR]: "A server error occurred.",
};

// 에러 메시지 생성
const getHttpUserMessage = (status?: number, fallbackMessage?: string) => {
    if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
    return fallbackMessage || DEFAULT_USER_MESSAGE;
};

// Zod 에러 정규화
const normalizeZodError = (error: ZodError, options?: ErrorHandlerOptions): AppError => {
    const details = error.issues.map((issue) => {
        const [ rowIndex ] = issue.path;
        const rowLabel = typeof rowIndex === "number" ? `${rowIndex + 1}행` : undefined;
        const errorMessage = issue.message;
        return rowLabel ? `${rowLabel}: ${errorMessage}` : errorMessage;
    });

    return {
        type: "validation",
        status: ERROR_STATUS.BAD_REQUEST,
        code: "ZOD_VALIDATION_ERROR",
        message: details.join("\n"),
        userMessage: details.join("\n"),
        source: options?.source,
        cause: error,
    };
};

// Axios 에러 정규화
const normalizeAxiosError = (error: AxiosError<ApiResponseLike>, options?: ErrorHandlerOptions): AppError => {
    
    const isNetworkError = !error.response;
    const isTimeout = error.code === "ECONNABORTED";
    const responseData = error.response?.data;
    const apiError = responseData?.apiError;
    const serverMessage = 
        apiError?.message ||        // 1순위: 서버가 명시한 apiError 메시지
        options?.fallbackMessage || // 2순위: 호출부가 보내준 fallbank 사용
        error.message ||            // 3순위: Axios 기본 message 사용
        ERROR_MESSAGES.DEFAULT      // 4순위: 시스템 기본 메시지 사용
        ;

    const status = error.response?.status;

    const type: AppErrorType = 
        isNetworkError
            ? "network"
            : status === ERROR_STATUS.UNAUTHORIZED
                ? "auth"
                : status !== undefined && status >= ERROR_STATUS.INTERNAL_SERVER_ERROR
                    ? "server"
                    : apiError?.code
                        ? "domain"
                        : "http";

    const code = isNetworkError 
        ? error.code 
        : apiError?.code || error.code;

    const message = isTimeout
        ? "Request timeout"
        : serverMessage;

    const userMessage = isTimeout
        ? "The request timed out."
        : isNetworkError
            ? "Unable to communicate with the server."
            : getHttpUserMessage(status, serverMessage);
    
    return {
        type,
        status,
        code,
        message,
        userMessage,
        source: options?.source,
        cause: error,
    };
};

// API 에러 정규화
const normalizeApiError = (error: ApiError, options?: ErrorHandlerOptions): AppError => ({
    type: error.code ? "domain" : "server",
    code: error.code ?? undefined,
    message: error.message || options?.fallbackMessage || ERROR_MESSAGES.DEFAULT,
    userMessage: error.message || options?.fallbackMessage || DEFAULT_USER_MESSAGE,
    source: options?.source,
    cause: error,
});

// API에러 확인 및 서버에러 정규화
const normalizeApiResponse = (response: ApiResponseLike, options?: ErrorHandlerOptions): AppError | null => {
    if (response.success !== false) return null;
    if (response.apiError) return normalizeApiError(response.apiError, options);

    return {
        type: "server",
        message: options?.fallbackMessage || ERROR_MESSAGES.DEFAULT,
        userMessage: options?.fallbackMessage || DEFAULT_USER_MESSAGE,
        source: options?.source,
        cause: response,
    };
};

// 기타 에러 정규화
function normalizeUnknownError(error: unknown, options?: ErrorHandlerOptions): AppError {
    if (error instanceof Error) {
        return {
            type: "client",
            code: error.name,
            message: error.message || options?.fallbackMessage || ERROR_MESSAGES.DEFAULT,
            userMessage: error.message || options?.fallbackMessage || DEFAULT_USER_MESSAGE,
            source: options?.source,
            cause: error,
        };
    }

    if (typeof error === "string") {
        return {
            type: "unknown",
            message: error,
            userMessage: error || options?.fallbackMessage || DEFAULT_USER_MESSAGE,
            source: options?.source,
            cause: error,
        };
    }

    return {
        type: "unknown",
        message: options?.fallbackMessage || ERROR_MESSAGES.DEFAULT,
        userMessage: options?.fallbackMessage || DEFAULT_USER_MESSAGE,
        source: options?.source,
        cause: error,
    };
}

// 에러 정규화
const normalizeError = (error: unknown, options?: ErrorHandlerOptions): AppError | null => {
    if(!error) return null;
    if(error instanceof ZodError) return normalizeZodError(error, options);
    if(isAxiosError<ApiResponseLike>(error)) return normalizeAxiosError(error, options);
    if(isApiResponseLike(error)) return normalizeApiResponse(error, options);
    return normalizeUnknownError(error, options);
};

// 중복에러 검증용 key값 생성
const getErrorKey = (error: AppError) =>
    [
        error.type,
        error.status ?? "",
        error.code ?? "",
        error.userMessage,
    ].join("|");

// 중복에러 제거
const dedupeErrors = (errors: AppError[]) => {
    const map = new Map<string, AppError>();

    errors.forEach((error) => {
        const key = getErrorKey(error);
        if (!map.has(key)) map.set(key, error);
    });

    return Array.from(map.values());
};

// 에러표시 기본함수
const defaultDisplay: ErrorDisplay = (errors) => {
    if (errors.length === 0) return;
    alert(errors.map((error) => error.userMessage).join("\n"));
};

// 에러 핸들러 생성
export function createErrorHandler(display: ErrorDisplay = defaultDisplay) {
    const errors: AppError[] = [];

    // 에러 수집
    const collect = (error: unknown, options?: ErrorHandlerOptions) => {
        const appError = normalizeError(error, options);
        if (appError) errors.push(appError);
    };

    // useQuery의 결과에서 에러 수집
    const collectResult = (result: ErrorCheckTarget, options?: ErrorHandlerOptions) => {
        if (result.error) collect(result.error, options);
        if (result.data) collect(result.data, options);
    };

    // 수집된 error 비우기
    const clear = () => {
        errors.length = 0;
    };

    // 중복에러 정리 및 에러 출력
    const getErrors = () => dedupeErrors(errors);

    // 수집된 에러 유무 파악
    const hasError = () => getErrors().length > 0;

    // 에러 표시
    const flush = () => {
        const dedupedErrors = getErrors();
        display(dedupedErrors);
        clear();
        return dedupedErrors;
    };

    return {
        collect,
        collectResult,
        clear,
        getErrors,
        hasError,
        flush,
    };
};
