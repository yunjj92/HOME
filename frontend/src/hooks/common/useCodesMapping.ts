import type { CodeData } from "../../api/zod/codeResponse.zod";
import { useListMapping } from "./useListMapping";

export function useCodesMapping(
    list: CodeData[],
) {
    return useListMapping(list, "code", "name");
};