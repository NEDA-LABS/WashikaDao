import { AppDataSource } from "../data-source";

afterAll(async () => {
    await AppDataSource.destroy()
    })

