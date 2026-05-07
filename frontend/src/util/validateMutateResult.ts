import type { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { validateMutateParam } from "./validateMutateParam";

interface CommonResponse<T = any> {
  success?: boolean;
  data?: T;
  apiError?: {
    message?: string;
    code?: string;
  } | null;
}

interface ValidateMutateResult<TData, TVariables> {
    isSuccess: boolean;
    alertErrorIntoMap: Error | null;
    validateMutateAsync: (variables: TVariables, inputSchema?: any) => Promise<TData>;
}

export function validateMutateResult<
    TData = any,
    TError = any,
    TVariables = any,
    TContext = any
>(
    mutationResult: UseMutationResult<TData, TError, TVariables, TContext>
): ValidateMutateResult<TData, TVariables> {
    
    const {error, isSuccess} = mutationResult;
    const errResponse = (error as AxiosError<CommonResponse>)?.response;

    const errorStatusTypeIntoMap = new Map<number, string>([
        [400, "Bad Request"],
        [401, "Unauthorized Access - Please log in."],
        [403, "Forbidden - You don't have permission to perform this action."],
        [500, "Internal Server Error"],
    ]);

    const alertErrorIntoMap = (status: number, message: string) => {
        const mappedMessage = errorStatusTypeIntoMap.get(status) || message;
        const error = new Error(mappedMessage);
        (error as any).status = status;
        return error;
    }
    
    return {
        isSuccess,
        alertErrorIntoMap: errResponse ? alertErrorIntoMap(errResponse.status, errResponse.data?.apiError?.message || "An error occurred during mutation") : null,
        validateMutateAsync: async (variables: TVariables, inputSchema?: any) => {

            if (inputSchema) {

                const validationResult = validateMutateParam(inputSchema, variables);
                if (validationResult instanceof Response) {
                    const validationErrorData = await validationResult.json() as { error: string };
                    throw alertErrorIntoMap(validationResult.status, validationErrorData.error);
                }
            }
            return await mutationResult.mutateAsync(variables);
        }
    }

}



