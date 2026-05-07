export function checkLoading(...results: { isLoading: boolean }[]) {
    return results.some((result) => result.isLoading);
};