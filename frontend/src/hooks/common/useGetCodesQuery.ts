import z from "zod";
import { useGetCodes } from "../../api/generated";
import { resolveQueryState } from "../../util/resolveQueryState";
import { codeResponseSchema } from "../../api/zod/codeResponse.zod";
import { parseToZodSchema } from "../../util/parseToZodSchema";

export function useGetCodesQuery(typeId:number) {
    const apiState = resolveQueryState(
        useGetCodes(
            { typeId: typeId },
            {
                query: {
                    staleTime: Infinity,
                    gcTime: Infinity,
                    retry: 1,
                }
            }
        ),
    );

    if(apiState.status !== "success") {
        return apiState;
    }

    return parseToZodSchema(
        apiState,
        z.array(codeResponseSchema),
    );

}