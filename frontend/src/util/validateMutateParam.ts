import { z } from "zod";


export function validateMutateParam<T extends z.ZodTypeAny>(
    inputSchema: T,
    param: any,
): z.output<T> | Response {

    if(param === null || param === undefined) {
        return Response.json(
            {error: "The result of the mutation is null or undefined"}, 
            {status: 500}
        )
    }

    const schemaTypeIsZodObject = inputSchema instanceof z.ZodObject;
    if (!schemaTypeIsZodObject) {
        return param;
    }

    const resultOfValidation = inputSchema.safeParse(param);

    if(!resultOfValidation.success) {
        return Response.json(
            {error: "The result of the mutation does not match the expected schema"}, 
            {status: 400}
        )
    }

    return param;
}
