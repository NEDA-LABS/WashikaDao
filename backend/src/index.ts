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
const allowedOrigins = [ "http://localhost:5173", "https://www.washikadao.xyz"];


app.use(
 cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     allowedHeaders: ["content-type", "Authorization"],
     credentials: true,
    })
)
app.use(express.json());// specifying we will be receiving the data in json format
//Endpoints to be used

app.use("/api/DaoGenesis", Authenticator,  DaoGenesisHandler);//funguaDao Page --> CreateDao
app.use("/api/Daokit/DaoDetails", Authenticator, DaoKitHandler);// all in dao activities like creating & managing membership & the various membership tiers
app.use("/api/DaoKit/MemberShip", Authenticator,  DaoMembershipHandler);
app.use("/api/DaoKit/Proposals", Authenticator, ProposalHandler)//CreateProposalPageHandler Page
app.use("/api/DaoKit/Funding", Authenticator, DaoFundingHandler);
app.use("/api/LearnBlogs", Authenticator, BlogContentHandler);//Elimu/Jifunze Page
app.use("/api/IsBackendAlive", IsBackendAliveHandler);

//Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
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
