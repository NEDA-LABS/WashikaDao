import { Request, Response, NextFunction } from 'express';


/*
 * Requires request to particular routes to contain an authorization header so only our client application can make requests for our server.
 * This is not to serve as any form of user oauth but to shield the server from unverified requests
 *
 */

export  function Authenticator(req: Request, res: Response, next: NextFunction): void {

 const apiKey = req.headers['x-api-key'];
 const ROUTE_PROTECTOR_KEY = process.env.ROUTE_PROTECTOR;

    if (apiKey === ROUTE_PROTECTOR_KEY) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }  if(apiKey !== ROUTE_PROTECTOR_KEY) {
               res
                 .status(403)
                 .json({ error: "Invalid secret code provided" });
      return;
    }

    next();
     }
