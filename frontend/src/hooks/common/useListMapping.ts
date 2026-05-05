import { useMemo } from "react";

export function useListMapping<
    T,
    K extends keyof T,
    V extends keyof T,
>(
    list: T[],
    keyField: K,
    valueField: V,
) {
    return useMemo(() => {
        return new Map(
            list
                .map((item) => {
                    const key = item[keyField];
                    const value = item[valueField];

                    return key != null && value != null ? [key, value] as const : null;
                })
                .filter(
                    (entry): entry is readonly [NonNullable<T[K]>, NonNullable<T[V]>] => entry !== null
                )
        )
    }, [list, keyField, valueField]);
};