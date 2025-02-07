import logger from "./utils/Helpers/Logger";

require('dotenv').config();
import express = require('express');
const router = express.Router();
const PORT = process.env.PORT || 8080;

import "reflect-metadata"
import cors from "cors";


import { AppDataSource } from "./data-source";

const app = express();
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
app.use(cors(corsOptions), logger);
app.use(express.json());// specifying we will be receiving the data in json format
//Endpoints to be used

app.use("/FunguaDao", require("./routes/DaoHandler"));//funguaDao Page --> CreateDao
//app.use("/Jifunze", require("./routes/JifunzePageHandler.ts"));//Elimu/Jifunze Page
//app.use("/DaoToolKit", require("./routes/DaoToolKitPageHandler"));//daoToolKit Page
app.use("/JiungeNaDao", require("./routes/DaoMembershipHandler"))//jiungeNaDao Page
app.use("/CreateProposal", require("./routes/ProposalHandler"))//CreateProposalPageHandler Page
app.use("/ViewProposal", require("./routes/ProposalHandler"))//ViewProposalPageHandler Page
app.use("/FundDao", require("./routes/DaoHandler"))//FundDaoPageHandler Page
app.use("/DaoProfile", require("./routes/DaoHandler"))//DaoProfilePageHandler Page
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
