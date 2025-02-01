import { timeStamp } from "console";
import { Request, Response, NextFunction } from "express";
import { EntityNotFoundError } from "typeorm";

export function GlobalErrorHandler ( err: any, req: Request, res: Response, next: NextFunction): void {
    let status = 500;
    let message = "An Internal Server Error Occurred when handling your request";

    if (err instanceof EntityNotFoundError) {
     status = 404;
     message = `Entity named ${err.name} not found`
    }

    res.status(status).json({
    timeStamp: new Date(),
    message,
    details: err.stack,
    })
}
