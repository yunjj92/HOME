export type ApiState<T = unknown> = 
    | { status: "loading"}
    | { status: "error"; message: string; code: string }
    | { status: "success"; data: T};
    