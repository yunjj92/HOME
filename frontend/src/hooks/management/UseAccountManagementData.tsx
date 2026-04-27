import { useInitAccountManagement } from "../../api/generated";
import { validateQueryResult } from "../../util/validateQueryResult";
import { initAccountManagementResponseSchema, type AccountManagementData } from "../../api/zod/accountManagementResponse.zod";

export function useAccountManagementData() {
    return validateQueryResult<AccountManagementData>(
        useInitAccountManagement({
            query: {
                staleTime: Infinity, // 이 호출에 대해서만 staleTime 적용
            }
        }),
        initAccountManagementResponseSchema,
    );
}
