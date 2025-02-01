import request from 'supertest';
import express, { Express } from 'express';
import { app } from "../index";


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
        const cdResponse = await request(app)
            .post('/DaoGenesis/CreateDao')
            .send(cdReqData);

        expect(cdResponse.status).toBe(201);
        expect(cdResponse.body).toHaveProperty('message', 'DAO created successfully')
    })
})

