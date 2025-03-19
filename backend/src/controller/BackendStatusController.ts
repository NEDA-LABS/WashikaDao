import express, { Request, Response } from "express";
export default async function BackendChecker(req: Request, res: Response) {
        return res
                .status(200)
                .json({message: "SystemIsRunningontheacessedport!"});
}
