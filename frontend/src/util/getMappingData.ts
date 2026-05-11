export function getMappingData(
    dataMap: Map<string | number, string>,
    orgin: string | number | null | undefined,
    fallbank = "-",
) {
    if(orgin == null) return fallbank;
    return dataMap.get(orgin) ?? fallbank;
}