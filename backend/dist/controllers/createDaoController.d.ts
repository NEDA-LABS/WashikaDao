import { Request, Response } from "express";
export declare const createNewDao: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDaoDetails: (req: Request, res: Response) => Promise<void>;