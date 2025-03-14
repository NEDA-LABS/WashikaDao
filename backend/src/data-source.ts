// import "reflect-metadata"
// import { DataSource } from "typeorm"
// import { Dao } from "./entity/Dao";
// import { MemberDetails } from "./entity/MemberDetails";
// import { Proposal } from "./entity/Proposal";
// import { Vote } from "./entity/Vote";
// import path from "path";

// const AppDataSource = new DataSource({
//   type:  'postgres', // Use PostgreSQL in production, SQLite in development
//   url:  process.env.DATABASE_URL, // Use DATABASE_URL in production
//   password: 'qatester',// Explicitly add password
//   username: 'njoguqa', //Explicitly add username
//   database: 'testerdb', // Explicitly add database.
//   synchronize: false, // Disable synchronize in production (use migrations instead)
//   logging: true, // Enable logging only in development
//   entities: [Dao, MemberDetails, Proposal, Vote], // Your entities
//   migrations: [path.join(__dirname, './migrations/*{.ts,.js}')], // Migration files
//   migrationsRun: true, // Automatically run migrations in production
// });

// export default AppDataSource;

import "reflect-metadata";
import { DataSource } from "typeorm";
import { Dao } from "./entity/Dao";
import { MemberDetails } from "./entity/MemberDetails";
import { Proposal } from "./entity/Proposal";
import { Vote } from "./entity/Vote";
import path from "path";
// import { DaoJoinDate, DaoRole, DaoStatus } from "./entity/DaoMembershipRelations";

const AppDataSource = new DataSource({
 url: process.env.DATABASE_URL,
 type: "postgres",
 synchronize: true, //synchronize only in development
  logging: true, //Log only in development
  entities: [Dao, MemberDetails, Proposal, Vote],
  migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")], //Configure migrations as needed
  subscribers: [],
});

export default AppDataSource;
