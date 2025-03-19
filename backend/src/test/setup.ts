import { TestDataSource } from '../test/data-source.test';

beforeAll(async () => {
    // Global setup if needed
});

afterAll(async () => {
    // Ensure database connection is always closed
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
}); 