import "reflect-metadata"
import { DataSource } from "typeorm"
//import { User } from "./entity/User"
import { Dao } from "./entity/Dao";
import { MemberDetails } from "./entity/MemberDetails";
import { Proposal } from "./entity/Proposal";
import { Vote } from "./entity/Vote";
import path from "path";

//Change to Postgres ??? More popular indexing option
/**
 * Configuration for creating a DataSource object using TypeORM.
 * This DataSource is used to connect to a MySQL database and manage entities.
 */
/*  INFO: Developer DB Localhost & ? Server ?
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
/**   INFO: Developer Localhost Testing DataSource
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "../test/mydb.sqlite",
    synchronize: true,
    logging: true,
    subscribers: [],
    entities: [Dao, MemberDetails, Proposal, Vote],
    migrations: []
});
  */
export const  AppDataSource = new DataSource({
    type: process.env.NODE_ENV === 'test' ? "sqlite" : (process.env.NODE_ENV === 'development' ? "sqlite" : "mysql"),
    database: process.env.NODE_ENV === 'test' ? ":memory:" : (process.env.NODE_ENV === 'development' ? "dev.sqlite" :   process.env.DATABASE_NAME),
    host: process.env.NODE_ENV === 'development' ? undefined : process.env.DATABASE_HOST, //no host for sqlite
    port: process.env.NODE_ENV === 'development' ? undefined : Number(process.env.DATABASE_PORT) || 3306, //no port of sqlite
    username: process.env.NODE_ENV === 'development' ? undefined : process.env.DATABASE_USER,
    password: process.env.NODE_ENV === 'development' ? undefined : process.env.DATABASE_PASSWORD,
    synchronize: process.env.NODE_ENV === 'development'? true :  false,//synchronize only in development
    logging: process.env.NODE_ENV === 'development' ? true : false,//Log only in development
    entities:[Dao, MemberDetails, Proposal, Vote],
    migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],  //Configure migrations as needed
    subscribers: [],
})
