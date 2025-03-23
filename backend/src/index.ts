require('dotenv').config();
import express, { Express } from "express";
const router = express.Router();
const PORT = process.env.PORT || 3000;

import "reflect-metadata"
import cors from 'cors';

import AppDataSource from "./data-source";

//Routes bro
import DaoGenesisHandler from "./routes/DaoGenesisHandler";
import DaoKitHandler from "./routes/DaoKitHandler";
import DaoMembershipHandler from "./routes/DaoMembershipHandler";
import ProposalHandler from "./routes/ProposalHandler";
import DaoFundingHandler from "./routes/DaoFundingHandler";
import BlogContentHandler from "./routes/BlogContentHandler";
import IsBackendAliveHandler from "./routes/IsBackendAliveHandler";

//Using our Client Authenticator
import { Authenticator } from "./utils/Authenticator/Authenticator";

export const app = express();
const allowedOrigins = [ "http://localhost:5173", "https://washikadao.xyz"];


app.use(
 cors({
      origin: allowedOrigins,
      //methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     allowedHeaders: ["content-type", "Authorization", "X-API-KEY"],

    })
)
app.use(express.json());// specifying we will be receiving the data in json format
//Endpoints to be used

app.use("/api/DaoGenesis",   DaoGenesisHandler);//funguaDao Page --> CreateDao
app.use("/api/Daokit/DaoDetails",  DaoKitHandler);// all in dao activities like creating & managing membership & the various membership tiers
app.use("/api/DaoKit/MemberShip",   DaoMembershipHandler);
app.use("/api/DaoKit/Proposals", Authenticator, ProposalHandler)//CreateProposalPageHandler Page
app.use("/api/DaoKit/Funding", Authenticator, DaoFundingHandler);
app.use("/api/LearnBlogs",  BlogContentHandler);//Elimu/Jifunze Page
app.use("/api/IsBackendAlive", IsBackendAliveHandler);

//Global error handler
app.use((err, req, res, next) => {
    if (err) {
    console.error(err.stack);
    res.status(500).send('Global error handler says Something broke!', err);
    }
    next();
    return;
});
// Initialize the data source and start the server
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        const server = app.listen(PORT, () => {
            console.log(`App is running on PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });


module.exports = router ;
