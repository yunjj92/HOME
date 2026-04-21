import { useStartRegistration } from "../../../api/generated";
import type { StartRegistrationResponse } from "../../../api/model";
import { startRegistrationResponseSchema, type StartRegistrationData } from "../../../api/zod/startRegistrationResponse.zod";
import type { ApiResponse } from "../../../schemas/common/api";
import { handleApiQuery } from "../../../util/handleApiQuery";

export function useStartRegistrationData() {
 
    const { mutateAsync , data:resultData , isPending: isLoading, error} = useStartRegistration();
    
    
    const result = handleApiQuery<StartRegistrationData>(
        resultData as ApiResponse<StartRegistrationResponse> | null | undefined,
        isLoading,
        error,
        startRegistrationResponseSchema
    );

    return{ mutateAsync, result};
} 