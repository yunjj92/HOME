import { useGetBanks } from "../../api/generated";
import { bankResponseSchema } from "../../api/zod/bankResponse.zod";
import { resolveQueryState } from "../../util/resolveQueryState";
import z from "zod";
import { parseToZodSchema } from "../../util/parseToZodSchema";

export function useGetBanksQuery() {
    const apiState = resolveQueryState(
        useGetBanks({
            query: {
                staleTime: Infinity,
                gcTime: Infinity,
                retry: 1,
            }
        })
    );

    if(apiState.status !== "success") {
        return apiState;
    }

    return parseToZodSchema(
        apiState,
        z.array(bankResponseSchema),
    );
}