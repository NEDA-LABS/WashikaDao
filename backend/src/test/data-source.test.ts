import { DataSource } from "typeorm";
import { config } from 'dotenv';
import { join } from "path";
config(); // Load environment variables

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:", // This creates an in-memory SQLite database
    entities: [join(__dirname, "../entities/**/*.{ts,js}")],
    synchronize: true,
    logging: true,
    dropSchema: true // This ensures a clean database for each test run
}); 
