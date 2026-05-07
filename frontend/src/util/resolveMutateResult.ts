import type { UseMutationResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { resolveMutateParam } from "./resolveMutateParam";
import { ERROR_STATUS, ERROR_MESSAGES } from "./errorConstants";

interface CommonResponse<T = any> {
  success?: boolean;
  data?: T;
  apiError?: {
    message?: string;
    code?: string;
    details?: string[];
  } | null;
  details?: string[];
}

interface ResolveMutateResult<TData, TVariables> {
    isSuccess: boolean;
    alertErrorIntoMap: Error | null;
    resolveMutateAsync: (variables: TVariables, inputSchema?: any) => Promise<TData>;
}

export function resolveMutateResult<
    TData = any,
    TError = any,
    TVariables = any,
    TContext = any
>(
    mutationResult: UseMutationResult<TData, TError, TVariables, TContext>
): ResolveMutateResult<TData, TVariables> {
    
    const {error, isSuccess} = mutationResult;
    const errResponse = isAxiosError<CommonResponse>(error) ? error.response : undefined;

    const getAlertError = (status: number, message: string, details?: string[]) => {
        const mappedMessage = ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES];
        let baseMessage: string = (mappedMessage || message || ERROR_MESSAGES.DEFAULT );
     
        if (mappedMessage && message && mappedMessage !== message && message !== ERROR_MESSAGES.DEFAULT) {
            baseMessage = `${mappedMessage} (${message})`;
        }
        
        let finalMessage = baseMessage;
        if (details && details.length > 0) {
            finalMessage = `${finalMessage}: ${details.join(', ')}`;
        }
        
        const err = new Error(finalMessage);
        (err as any).status = status;
        (err as any).details = details;
        return err;
    }
    
    return {
        isSuccess,
        alertErrorIntoMap: errResponse ? getAlertError(
            errResponse.status, 
            errResponse.data?.apiError?.message || ERROR_MESSAGES.DEFAULT,
            errResponse.data?.apiError?.details || errResponse.data?.details
        ) : null,
        resolveMutateAsync: async (variables: TVariables, inputSchema?: any) => {

            let targetVariables = variables;
            if(inputSchema) {
                const validationResult = resolveMutateParam(inputSchema, variables);
                
                if (validationResult instanceof Response) {
                    const validationErrorData = await validationResult.json() as { error: string, details?: string[] };
                    throw getAlertError(validationResult.status, validationErrorData.error, validationErrorData.details);
                }
                targetVariables = validationResult;
            }

            const result = await mutationResult.mutateAsync(targetVariables);

            // Handle application-level error
            const commonResult = result as CommonResponse;
            if (commonResult && (!commonResult.success || !commonResult.data)) {
                 throw getAlertError(ERROR_STATUS.INTERNAL_SERVER_ERROR, commonResult.apiError?.message || ERROR_MESSAGES.DEFAULT);
            }
            
            return result;
        }
    }
}

