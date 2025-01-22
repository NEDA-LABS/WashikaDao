import { AppDataSource } from "../data-source";

beforeAll(async () => {
    await AppDataSource.initialize()
})
