import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from "jsonwebtoken";

export const Authenticator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(`Authorization header is ${authHeader}`);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

    if (!token) {
          res
            .status(401)
            .json({ message: 'Unauthorized request: No token provided!' });
    }

    jwt.verify(token, process.env.ROUTE_PROTECTOR_API_KEY as string, (err, user) => {
        if (err) {
            console.error(`Token Verification Error ${err}`);
                return res
                         .status(403)
                         .json({ message: "Forbidden Request, Invalid Token Provided" });
        }

    console.log("Token Verification Successful");
    next(); // Token is valid, proceed to the route handler
    });
}
