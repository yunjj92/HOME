import { z } from 'zod';
import { useFinishLogin } from "../../api/generated";
import { handleApiQuery } from "../../util/handleApiQuery";
import { createApiResponseSchema, type ApiResponse } from '../../schemas/common/api';

interface UseFinishLoginParam{
    username: string;
    jsonparam: string;
}

export function useFinishLoginData() {
    const { mutateAsync , data, isPending: isLoading, error, isSuccess} = useFinishLogin();

    const result = handleApiQuery<string>(
        data as ApiResponse<string> | null | undefined,
        isLoading,
        error,
        createApiResponseSchema(z.string())
    );

    const finishLoginProcess = async (param: UseFinishLoginParam) => {
        return await mutateAsync({data: param.jsonparam, params: {username: param.username}});
    }
    
    return{ mutateAsync: finishLoginProcess, result, isSuccess};
}
