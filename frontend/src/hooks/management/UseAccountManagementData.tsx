import { useInitAccountManagement } from "../../api/generated";
import { handleApiQuery } from "../../util/handleApiQuery";
import type { ApiResponse } from "../../schemas/common/api";
import { initAccountManagementResponseSchema, type AccountManagementData } from "../../api/zod/accountManagementResponse.zod";
import type { AccountManagementResponse } from "../../api/model";

export function useAccountManagementData() {
    const { data, isLoading, isError } = useInitAccountManagement({
        query: {
            staleTime: Infinity, // 이 호출에 대해서만 staleTime 적용
        }
    });

    const result = handleApiQuery<AccountManagementData>(
        data as ApiResponse<AccountManagementResponse> | null | undefined,
        isLoading,
        isError,
        initAccountManagementResponseSchema
    );

    const finalData = data?.data;

    return {result, isLoading, isError, finalData}

}
