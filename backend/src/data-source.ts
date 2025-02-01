import "reflect-metadata"
import { DataSource } from "typeorm"
import { Dao } from "./entity/Dao";
import { MemberDetails } from "./entity/MemberDetails";
import { Proposal } from "./entity/Proposal";
import { Vote } from "./entity/Vote";
import path from "path";
 /**
 const  AppDataSource = new DataSource({
    type:  'sqlite',
    database: "./mydevdb.sqlite",
    synchronize: true,//synchronize only in development
    logging: true,//Log only in development
    entities:[Dao, MemberDetails, Proposal, Vote],
    migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],  //Configure migrations as needed
    subscribers: [],
})

*/
//Determine the environment
const isProduction = process.env.NODE_ENV === 'production';

 const AppDataSource = new DataSource({
  type: isProduction ? 'postgres' : 'sqlite', // Use PostgreSQL in production, SQLite in development
  url: isProduction ? process.env.DATABASE_URL : undefined, // Use DATABASE_URL in production
  database: isProduction ? undefined : './mydevdb.sqlite', // SQLite database file for development
  synchronize: !isProduction, // Disable synchronize in production (use migrations instead)
  logging: true, // Enable logging only in development
  entities: [Dao, MemberDetails, Proposal, Vote], // Your entities
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')], // Migration files
  migrationsRun: isProduction, // Automatically run migrations in production
  extra: isProduction
    ? {
        ssl: {
          rejectUnauthorized: false, // Required for some PostgreSQL providers (e.g., Coolify)
        },
      }
    : undefined, // SSL configuration for production
});

export default AppDataSource;
