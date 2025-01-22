import { Request, Response } from "express";
import { CreateNewDao } from "../controller/DaoController";
import { AppDataSource } from "../data-source";
import { Dao } from "../entity/Dao";
import { DataSource } from "typeorm";
import { mock } from "jest-mock-extended";

let dataSource: DataSource;
describe("CreateNewDao (Integration Test)", () => {
  it("should successfully create a DAO and save it to the database", async () => {
    const mockRequest = mock<Request>();
    const mockResponse = mock<Response>();
    mockRequest.body = {
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
      members: []
    };

    await CreateNewDao(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "DAO created and members added successfully",
      daoMultisigAddr: "0xTestAddress",
    });

    // Verify that the DAO was actually saved in the database
    const daoRepository = dataSource.getRepository(Dao);
    const savedDao = await daoRepository.findOne({ where: { daoMultiSigAddr: "0xTestAddress" } });
    expect(savedDao).toBeDefined();
    expect(savedDao?.daoName).toBe("Test DAO");
    // Add more assertions to check other properties
  });

  it("should return 400 for existing multiSigAddr", async () => {
    const mockRequest = mock<Request>();
    const mockResponse = mock<Response>();
    mockRequest.body = {
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
      members: []
    };

    await CreateNewDao(mockRequest, mockResponse);
    await CreateNewDao(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "DAO with this multiSigAddr already exists." });
  });
});