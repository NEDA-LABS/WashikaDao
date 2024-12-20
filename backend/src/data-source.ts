import "reflect-metadata"
import { DataSource } from "typeorm"
//import { User } from "./entity/User"
import { Dao } from "./entity/Dao";
import { MemberDetails } from "./entity/MemberDetails";
import { Proposal } from "./entity/Proposal";
import { Vote } from "./entity/Vote";

//Change to Postgres ??? More popular indexing option
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
    synchronize: true,
    logging: true,
    subscribers: [],
    entities: [Dao, MemberDetails, Proposal, Vote],
    migrations: []
});
 
