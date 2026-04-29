import { useGetAccounts } from "../../api/generated";
import { accountResponseSchema } from "../../api/zod/accountResponse.zod";
import { resolveQueryState } from "../../util/resolveQueryState";
import { parseToZodSchema } from "../../util/parseToZodSchema";
import z from "zod";

export function useGetAccountsQuery() {
    const apiState = resolveQueryState(
        useGetAccounts({
            query: {
                staleTime: Infinity,
                gcTime: Infinity,
                retry: 1,
            }
        }),
    );

    if(apiState.status !== "success") {
        return apiState;
    }

    return parseToZodSchema(
        apiState,
        z.array(accountResponseSchema),
    );
}