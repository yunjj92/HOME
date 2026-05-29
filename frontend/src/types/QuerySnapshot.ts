import type { ApiResponse } from "../services/schemas/common/api"

export type QuerySnapshot = {
    data: ApiResponse<unknown> | undefined;
    isLoading: boolean;
    error: Error | null;
};
