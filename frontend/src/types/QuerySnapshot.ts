import type { ApiResponse } from "../schemas/common/api"

export type QuerySnapshot<TData, TError> = {
    data: ApiResponse<TData> | undefined;
    isLoading: boolean;
    error: TError | null;
};