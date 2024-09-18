import "reflect-metadata"
import { DataSource } from "typeorm"
//import { User } from "./entity/User"
const Dao = require("../src/entity/Dao"); 
const MemberDetails = require("../src/entity/MemberDetails"); 
const Proposal = require("../src/entity/Proposal");
const Vote = require("../src/entity/Vote");

/**
 * Configuration for creating a DataSource object using TypeORM.
 * This DataSource is used to connect to a MySQL database and manage entities.
 */
/*
export const AppDataSource = new DataSource({
   // type: "mysql", /** * The type of the database. In this case, it's MySQL.*/
   // host: "localhost",
   // port: 3306,
    //username: "root",
    //password: "8912007C",
    //database: "washika",
   // synchronize: true,
    //logging: false,
//entities: [Dao, MemberDetails, Proposal, Vote],
  //  migrations: [],
    //subscribers: [],
//})
//**/
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "../test/mydb.sqlite",
    synchronize: false,
    logging: true,
    subscribers: [],
    entities: [Dao, MemberDetails, Proposal, Vote],
    migrations: []
});
 
