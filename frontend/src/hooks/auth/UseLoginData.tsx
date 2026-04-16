import { useStartLogin } from "../../api/generated";
import type { LoginResponse } from "../../api/model";
import { loginResponseSchema } from "../../api/zod/loginResponse.zod";
import type { ApiResponse } from "../../schemas/common/api";
import { handleApiQuery } from "../../util/handleApiQuery";

export function useLoginData() {

    const { mutateAsync , data:resultData, isPending: isLoading, error} = useStartLogin();

    const result = handleApiQuery<LoginResponse>(
        resultData as ApiResponse<LoginResponse> | null | undefined,
        isLoading,
        error,
        loginResponseSchema
    );

    return{ mutateAsync, result};

}