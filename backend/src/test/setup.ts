import { AppDataSource } from "../data-source";

let dataSource;
beforeAll(async () => {
   dataSource =  await AppDataSource.initialize()
    await dataSource.runMigrations(); //Run migrations
})
