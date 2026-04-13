import { useInitAccountManagement } from "../../api/generated";
import { handleApiQuery } from "../../util/handleApiQuery";
import type { ApiQueryResult } from "../../types/ApiQueryResult";
import type { ApiResponse } from "../../schemas/common/api";
import { initAccountManagementResponseSchema, type AccountManagementData } from "../../api/zod/accountManagementResponse.zod";
import type { AccountManagementResponse } from "../../api/model";

export function useAccountManagementData(): ApiQueryResult<AccountManagementData> {
    const { data, isLoading, error } = useInitAccountManagement({
        query: {
            staleTime: Infinity, // 이 호출에 대해서만 staleTime 적용
            refetchOnMount: false,
        }
    });

    return handleApiQuery<AccountManagementData>(
        data as ApiResponse<AccountManagementResponse> | null | undefined,
        isLoading,
        error,
        initAccountManagementResponseSchema
    );
}
