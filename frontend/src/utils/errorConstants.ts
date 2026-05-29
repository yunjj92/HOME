export const ERROR_STATUS = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
    [ERROR_STATUS.BAD_REQUEST]: "Bad Request",
    [ERROR_STATUS.UNAUTHORIZED]: "Unauthorized Access - Please log in.",
    [ERROR_STATUS.FORBIDDEN]: "Forbidden - You don't have permission to perform this action.",
    [ERROR_STATUS.NOT_FOUND]: "Not Found",
    [ERROR_STATUS.INTERNAL_SERVER_ERROR]: "Internal Server Error",
    DEFAULT: "An error occurred during mutation",
    VALIDATION_FAILED: "The result of the mutation does not match the expected schema",
    NULL_OR_UNDEFINED: "The result of the mutation is null or undefined",
} as const;
