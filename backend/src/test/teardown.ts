import { AppDataSource } from "../data-source";

let dataSource;
afterAll(async () => {
    if(dataSource.isInitialized) {
    await dataSource.dropDatabase();  // Drop the database after tests
    await dataSource.destroy()
    }
    })

