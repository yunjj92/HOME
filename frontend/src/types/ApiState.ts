export type ApiState<T> = 
    | { status: "loading"}
    | { status: "error"; message: string; code: string }
    | { status: "success"; data: T};
