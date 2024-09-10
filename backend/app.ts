require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8080;

import "reflect-metadata"
import { DataSource } from "typeorm";
import { Dao } from "./models/Dao.ts";
import { MemberDetails } from "./models/MemberDetails.ts"; // Assuming Members model is defined in Members.ts

export const AppDataSource = new DataSource({
    type: 'sqlite', //will be switched to postgres for prod
    database: 'dao.db',
    entities: [Dao, MemberDetails],
    synchronize: true
})

const app = express();

//Endpoints to be used
app.use("/", require("./routes/homePageHandler.ts"));//HomePage --> DashBoard 
app.use("/FunguaDao", require("./routes/FunguaDaoPageHandler.ts"));//funguaDao Page --> CreateDao
app.use("/Jifunze", require("./routes/JifunzePageHandler.ts"));//Elimu/Jifunze Page
app.use("/DaoToolKit", require("./routes/DaoToolKitPageHandler.ts"));//daoToolKit Page
app.use("/JiungeNaDao", require("./routes/JiungeNaDaoPageHandler.ts"))//jiungeNaDao Page
app.use("/CreateProposal", require("./routes/CreateProposalPageHandler.ts"))//CreateProposalPageHandler Page 
app.use("/ViewProposal", require("./routes/ViewProposalPageHandler"))//ViewProposalPageHandler Page 
app.use("/FundDao", require("./routes/FundDaoPageHandler"))//FundDaoPageHandler Page 
app.use("/DaoProfile", require("./routes/DaoProfilePageHandler"))//DaoProfilePageHandler Page 


const server = app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})


