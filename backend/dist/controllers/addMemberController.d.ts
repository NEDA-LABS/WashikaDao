import { Request, Response } from "express";
export declare const addMember: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMemberDetails: (req: Request, res: Response) => Promise<void>;
