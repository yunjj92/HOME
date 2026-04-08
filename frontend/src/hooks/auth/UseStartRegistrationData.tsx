import type { StartRegistrationResponse } from "../../api/model";
import type { ApiQueryResult } from "../../types/ApiQueryResult";
import { handleApiQuery } from "../../util/handleApiQuery";

export function useStartRegistrationData(): ApiQueryResult<StartRegistrationResponse> {
    return handleApiQuery<StartRegistrationResponse>(
        useInit, 
        initAccountManagementResponseSchema
    );
}