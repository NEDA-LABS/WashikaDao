import "reflect-metadata"
import { DataSource } from "typeorm"
import { Dao } from "./entity/Dao";
import { MemberDetails } from "./entity/MemberDetails";
import { Proposal } from "./entity/Proposal";
import { Vote } from "./entity/Vote";
import path from "path";

export const  AppDataSource = new DataSource({
    type: process.env.NODE_ENV ===  'production' ? "postgres" :  (process.env.NODE_ENV === 'development' ? "sqlite" : "sqlite"),
    database: process.env.NODE_ENV === 'test' ? ":memory:" : (process.env.NODE_ENV === 'development' ? "../test/mydb.sqlite" :   process.env.DATABASE_NAME),
    host: process.env.NODE_ENV === 'production' ?  process.env.DATABASE_HOST : undefined, //no host for sqlite, thus only host for production
    port: process.env.NODE_ENV === 'development' ? undefined : Number(process.env.DATABASE_PORT) || 5432, //no port of sqlite
    username: process.env.NODE_ENV === 'production' ? process.env.DATABASE_USER : undefined,
    password: process.env.NODE_ENV === 'production' ?  process.env.DATABASE_PASSWORD : undefined,
    synchronize: true,//synchronize only in development
    logging: process.env.NODE_ENV === 'development' ? true : false,//Log only in development
    entities:[Dao, MemberDetails, Proposal, Vote],
    migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],  //Configure migrations as needed
    subscribers: [],
})

