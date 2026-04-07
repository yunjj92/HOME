import { useInitAccountManagement } from "../../api/generated";
import {
    initAccountManagementResponseSchema,
    type AccountManagementData,
} from "../../schemas/account/account-management";
import { handleApiQuery } from "../../util/handleApiQuery";
import type { ApiQueryResult } from "../../types/ApiQueryResult";

export function useAccountManagementData(): ApiQueryResult<AccountManagementData> {
    return handleApiQuery<AccountManagementData>(
        useInitAccountManagement(), 
        initAccountManagementResponseSchema
    );
}