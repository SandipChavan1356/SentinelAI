class ApiError extends Error {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
    errors: any[];

    constructor(
        statuscode: number,
        message = "Something went wrong",
        errors: any[] = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statuscode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            this.stack = new Error().stack;
        }
    }
}

export { ApiError };