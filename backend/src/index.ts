require('dotenv').config();
const express = require('express');
const router = express.Router();
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

const app = express();

//Endpoints to be used
//app.use("/", require("./routes/homePageHandler.ts"));//HomePage --> DashBoard 
app.use("/FunguaDao", require("./routes/DaoHandler"));//funguaDao Page --> CreateDao
//app.use("/Jifunze", require("./routes/JifunzePageHandler.ts"));//Elimu/Jifunze Page
//app.use("/DaoToolKit", require("./routes/DaoToolKitPageHandler"));//daoToolKit Page
app.use("/JiungeNaDao", require("./routes/DaoMembershipHandler"))//jiungeNaDao Page
app.use("/CreateProposal", require("./routes/ProposalHandler"))//CreateProposalPageHandler Page 
app.use("/ViewProposal", require("./routes/ProposalHandler"))//ViewProposalPageHandler Page 
app.use("/FundDao", require("./routes/DaoHandler"))//FundDaoPageHandler Page 
app.use("/DaoProfile", require("./routes/DaoHandler"))//DaoProfilePageHandler Page 


const server = app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})

module.exports = router ;