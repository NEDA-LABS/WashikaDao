import "reflect-metadata"
import { DataSource } from "typeorm"
//import { User } from "./entity/User"
const Dao = require("../src/entity/Dao"); 
const MemberDetails = require("../src/entity/MemberDetails"); 
const Proposal = require("../src/entity/Proposal");
const Vote = require("../src/entity/Vote"); 

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
