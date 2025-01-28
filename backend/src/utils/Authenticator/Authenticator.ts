import { Request, Response, NextFunction } from 'express';

export const RouteOAuthManager = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized request: No token provided' });
    }

    //Route protector api key
    if (token !== process.env.ROUTE_PROTECTOR_API_KEY) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    next(); // Token is valid, proceed to the route handler
}
