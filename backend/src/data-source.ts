import "reflect-metadata"
import { DataSource } from "typeorm"
import { Dao } from "./entity/Dao";
import { MemberDetails } from "./entity/MemberDetails";
import { Proposal } from "./entity/Proposal";
import { Vote } from "./entity/Vote";
import path from "path";

 const  AppDataSource = new DataSource({
    type:  'sqlite',
    database: "./mydevdb.sqlite",
    synchronize: true,//synchronize only in development
    logging: true,//Log only in development
    entities:[Dao, MemberDetails, Proposal, Vote],
    migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],  //Configure migrations as needed
    subscribers: [],
})

export default AppDataSource;
