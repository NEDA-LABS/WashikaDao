require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8080;

import "reflect-metadata"
import { DataSource } from "typeorm";
const Dao = require("./entity/Dao");  
const MemberDetails = require("./entity/MemberDetails"); 
const Proposal = require("./entity/Proposal");
const Vote = require("./entity/Vote");  

/*
export const AppDataSource = new DataSource({
    type: 'sqlite', //will be switched to postgres for prod
    database: 'dao.db',
    entities: [Dao, MemberDetails, Proposal, Vote],
    synchronize: true /**This enables automatic migrations as opposed to manual ones that help with db version control, as app grows will be toggled and subsequent changes in set up made */
//}) 

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "8912007C",
    database: "washika",
    synchronize: true,
    logging: false,
entities: [Dao, MemberDetails, Proposal, Vote],
    migrations: [],
    subscribers: [],
})


const app = express();

//Endpoints to be used
//app.use("/", require("./routes/homePageHandler.ts"));//HomePage --> DashBoard 
app.use("/FunguaDao", require("./routes/DaoHandler.ts"));//funguaDao Page --> CreateDao
//app.use("/Jifunze", require("./routes/JifunzePageHandler.ts"));//Elimu/Jifunze Page
app.use("/DaoToolKit", require("./routes/DaoToolKitPageHandler.ts"));//daoToolKit Page
app.use("/JiungeNaDao", require("./routes/JoinDaoHandler.ts"))//jiungeNaDao Page
app.use("/CreateProposal", require("./routes/ProposalHandler.ts"))//CreateProposalPageHandler Page 
app.use("/ViewProposal", require("./routes/ProposalHandler.ts"))//ViewProposalPageHandler Page 
app.use("/FundDao", require("./routes/FundDaoHandler.ts"))//FundDaoPageHandler Page 
app.use("/DaoProfile", require("./routes/DaoHandler"))//DaoProfilePageHandler Page 


const server = app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})