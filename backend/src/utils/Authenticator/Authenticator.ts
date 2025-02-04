import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticator = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader); // Debug log
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized request: No token provided' });
    }

    jwt.verify(token, process.env.ROUTE_PROTECTOR_API_KEY as string, (err, user) => {
        if (err) {
            console.error("Token verification error:", err); // Log error details
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        console.log("Token verified successfully");
        next();
    });
};
