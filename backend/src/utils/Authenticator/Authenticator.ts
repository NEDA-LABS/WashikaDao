import { Request, Response, NextFunction } from 'express';


/*
 * Requires request to particular routes to contain an authorization header so only our client application can make requests for our server.
 * This is not to serve as any form of user oauth but to shield the server from unverified requests
 *
 */
export  function Authenticator(req: Request, res: Response, next: NextFunction): void {

  const authCode = req.headers['authorization'];

     if(!authCode) {
              res
                .status(401)
                .json({error: "No authorization code provided" })
       return;
    } 

    if(authCode !== process.env.ROUTE_PROTECTOR) {
               res
                 .status(403)
                 .json({ error: "Invalid secret code provided" });
      return; 
    } 

    next();
     }
