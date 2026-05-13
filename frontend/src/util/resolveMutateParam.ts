import { z } from "zod";
import { ERROR_STATUS, ERROR_MESSAGES } from "./errorConstants";

export function resolveMutateParam<T extends z.ZodTypeAny>(
    inputSchema: T,
    param: any,
): z.output<T> | Response {

    if(param === null || param === undefined) {
        return Response.json(
            {error: ERROR_MESSAGES.NULL_OR_UNDEFINED}, 
            {status: ERROR_STATUS.INTERNAL_SERVER_ERROR}
        )
    }

    // Use safeParse if it exists, regardless of whether it's a ZodObject or not
    if (typeof inputSchema.safeParse !== 'function') {
        return param;
    }

    const resultOfValidation = inputSchema.safeParse(param.data); 
    
    if(!resultOfValidation.success) {
        const issues = resultOfValidation.error.issues || [];
        return Response.json(
            {
                error: ERROR_MESSAGES.VALIDATION_FAILED,
                details: issues.map(err => `${err.path.join('.')}: ${err.message}`)
            }, 
            {status: ERROR_STATUS.BAD_REQUEST}
        )
    }

    return param;
}
