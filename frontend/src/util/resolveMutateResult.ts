import type { UseMutationResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { resolveMutateParam } from "./resolveMutateParam";
import { ERROR_STATUS, ERROR_MESSAGES } from "./errorConstants";
import { z } from "zod";

export interface MappedError extends Error {
    status: number;
    details?: string[];
}

interface CommonResponse<T = unknown> {
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
    alertErrorIntoMap: MappedError | null;
    resolveMutateAsync: (variables: TVariables, inputSchema?: z.ZodTypeAny) => Promise<TData>;
}

export function resolveMutateResult<
    TData = unknown,
    TError = unknown,
    TVariables = unknown,
    TContext = unknown
>(
    mutationResult: UseMutationResult<TData, TError, TVariables, TContext>
): ResolveMutateResult<TData, TVariables> {
    
    const {error, isSuccess} = mutationResult;
    const errResponse = isAxiosError<CommonResponse>(error) ? error.response : undefined;

    const getAlertError = (status: number, message: string, details?: string[]): MappedError => {
        const mappedMessage = ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES];
        let baseMessage: string = (mappedMessage || message || ERROR_MESSAGES.DEFAULT );
     
        if (mappedMessage && message && mappedMessage !== message && message !== ERROR_MESSAGES.DEFAULT) {
            baseMessage = `${mappedMessage} (${message})`;
        }
        
        let finalMessage = baseMessage;
        if (details && details.length > 0) {
            finalMessage = `${finalMessage}: ${details.join(', ')}`;
        }
        
        const err = new Error(finalMessage) as MappedError;
        err.status = status;
        err.details = details;
        return err;
    }
    
    return {
        isSuccess,
        alertErrorIntoMap: errResponse ? getAlertError(
            errResponse.status, 
            errResponse.data?.apiError?.message || ERROR_MESSAGES.DEFAULT,
            errResponse.data?.apiError?.details || errResponse.data?.details
        ) : null,
        resolveMutateAsync: async (variables: TVariables, inputSchema?: z.ZodTypeAny) => {

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
            const commonResult = result as CommonResponse<TData>;
            if (commonResult && (!commonResult.success || !commonResult.data)) {
                 throw getAlertError(ERROR_STATUS.INTERNAL_SERVER_ERROR, commonResult.apiError?.message || ERROR_MESSAGES.DEFAULT);
            }
            
            return result;
        }
    }
}

