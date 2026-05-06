type ErrorCheckTarget = {
    error: unknown;
    data?: {
        success?: boolean;
        apiError?: {
            message?: string | null;
            code?: string | null;
        } | null;
    };
};

export function checkError(...results : ErrorCheckTarget[]) {
    results.forEach((entry) => {
        if(entry.error) alert(entry.error);
        if(entry.data && !entry.data?.success) alert(entry.data?.apiError);
    });
};