import { Request, Response } from "express";
export declare const requestToJoinDao: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
