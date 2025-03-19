import request from 'supertest';
import { Express } from 'express';
import { app } from "../index";
import { TestDataSource } from '../test/data-source.test';

let server: any;

beforeAll(async () => {
    // Initialize the test database connection
    try {
        await TestDataSource.initialize();
        // Replace the app's data source
        (app as any).set('database', TestDataSource);
    } catch (error) {
        console.error("Error during Test Data Source initialization:", error);
        throw error;
    }
    
    // Start the server
    server = app.listen(0);
});

afterAll(async () => {
    // Close database connection and server
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
});

describe('Create A new Dao', () => {
    it("Successfully creates a Dao", async () => {
        const cdReqData = {
            daoName: "Test DAO",
            daoLocation: "Test Location",
            targetAudience: "Test Audience",
            daoTitle: "Test Title",
            daoDescription: "Test Description",
            daoOverview: "Test Overview",
            daoImageIpfsHash: "Test Hash",
            daoRegDocs: "Test Docs",
            multiSigAddr: "0xTestAddress",
            multiSigPhoneNo: "1234567890",
            kiwango: 100,
            accountNo: "Test Account",
            nambaZaHisa: "Test Hisa",
            kiasiChaHisa: "Test Kiasi",
            interestOnLoans: 5,
        };

        const cdResponse = await request(server)
            .post('/api/DaoGenesis/CreateDao')  // Updated to match your actual route
            .send(cdReqData);

        expect(cdResponse.status).toBe(201);
        expect(cdResponse.body).toHaveProperty('message', 'DAO created successfully');
    });
});

