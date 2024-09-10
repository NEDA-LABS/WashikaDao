import { Request, Response } from "express";
export declare const whiteListMember: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
