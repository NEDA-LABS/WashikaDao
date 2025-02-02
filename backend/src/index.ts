require('dotenv').config();
import express, { Express } from "express";
const router = express.Router();
const PORT = process.env.PORT || 3000;

import "reflect-metadata"
import cors from 'cors';

import  AppDataSource  from "./data-source";

//Routes bro
import DaoGenesisHandler from "./routes/DaoGenesisHandler";
import DaoKitHandler from "./routes/DaoKitHandler";
import DaoMembershipHandler from "./routes/DaoMembershipHandler";
import ProposalHandler from "./routes/ProposalHandler";
import DaoFundingHandler from "./routes/DaoFundingHandler";
import BlogContentHandler from "./routes/BlogContentHandler";

export const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        }  else {
            callback(new Error('Cors has you as persona non-grata'))
        }
    }
}

app.use(cors(corsOptions));
app.use(express.json());// specifying we will be receiving the data in json format
//Endpoints to be used

app.use("/DaoGenesis", DaoGenesisHandler);//funguaDao Page --> CreateDao
app.use("/Daokit/DaoDetails", DaoKitHandler);// all in dao activities like creating & managing membership & the various membership tiers
app.use("/DaoKit/MemberShip", DaoMembershipHandler);
app.use("/DaoKit/Proposals", ProposalHandler)//CreateProposalPageHandler Page
app.use("/DaoKit/Funding", DaoFundingHandler);
app.use("/LearnBlogs", BlogContentHandler);//Elimu/Jifunze Page

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

    /*
const server = app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})
*/

module.exports = router ;
