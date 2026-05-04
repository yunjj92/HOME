import { useMemo } from "react";
import type { CodeData } from "../../api/zod/codeResponse.zod";

export function useCodesMemo(
    codes: CodeData[],
) {
    return useMemo(() => {
        return new Map(
            codes.map((code) => [code.code, code.name]),
        )
    }, [codes]);
};