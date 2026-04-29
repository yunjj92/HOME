import type { ApiResponse } from "../schemas/common/api"

export type QuerySnapshot = {
    data: ApiResponse<unknown> | undefined;
    isLoading: boolean;
    error: Error | null;
};
