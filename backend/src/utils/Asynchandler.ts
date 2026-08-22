import { Request, Response, NextFunction } from "express";

const asyncHandler = (
    requestResolver: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => any
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        Promise
            .resolve(requestResolver(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };