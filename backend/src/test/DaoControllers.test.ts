import { Request, Response } from "express";
import { CreateNewDao, GetAllDaosInPlatform, UpdateDaoDetails, FundDao } from "../controller/DaoController";
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
    };

    await CreateNewDao(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "DAO created  successfully",
      //daoMultisigAddr: "0xTestAddress",
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
describe("GetAllDaosInPlatform", () => {
  it("should return 200 with all the daos in a list", async function() {
    const mockRequest = mock<Request>();
    const mockResponse = mock<Response>();

    //create some test DAOs in the database
   const dummyDaoRepository =  dataSource.getRepository(Dao);
   const dummyDaos = [
        { daoName: "DAO 1", daoMultiSigAddr: "0x1" },
        { daoName: "Dao 2", daoMultiSigAddr: "0x2" },
        ];
        //Saving the dummy data in a dummy repository
        await dummyDaoRepository.save(dummyDaos);
        //testing the result of the method call  using our mock request, response & dummy data
        await GetAllDaosInPlatform(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          daoList: expect.arrayContaining([
              expect.objectContaining({ daoName: "DAO 1", daoMultiSigAddr: "0x1" }),
                expect.objectContaining({ daoName: "DAO 2", daoMultiSigAddr: "0x2" }),
            ])
        })
  })

 it("should return a 200 with an empty list if no DAOs exist", async () => {
   const mReq = mock<Request>();
   const mRes  = mock<Response>();

    await GetAllDaosInPlatform(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith({ daoList: [] });
 })

 it("should handle database errors & return 500", async () => {
   const mReq = mock<Request>();
   const mRes  = mock<Response>();

  //Mock the repository to throw an error
   const dummyDaoRepository =  dataSource.getRepository(Dao);
    jest.spyOn(dummyDaoRepository, 'find').mockRejectedValue(new Error("Database error"));

    await GetAllDaosInPlatform(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(500);
    expect(mRes.json).toHaveBeenCalledWith({ error: "Error retrieving DAO list" });

 })
})

describe("UpdateDaoDetails", () => {
    const mReq = mock<Request>();
    const mRes = mock<Response>();

   it("should return 400 when called with a missing multisig address", async function (){
      mReq.params = {}; //missing params
     await UpdateDaoDetails(mReq, mRes);
    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.json).toHaveBeenCalledWith({ error: "Missing required url param: multiSigAddr" });
   });

  it("should return 404 if DAO not found", async () => {
    mReq.params = { multiSigAddr: "nonExistentAddress" };
    mReq.body = {
           // Provide all required fields, but the DAO doesn't exist
            daoName: "Updated DAO Name",
            daoLocation: "Updated Location",
            targetAudience: "Updated Audience",
            daoTitle: "Updated Title",
            daoDescription: "Updated Description",
            daoOverview: "Updated Overview",
            daoImageIpfsHash: "Updated Hash",
            daoRegDocs: "Updated Docs",
            multiSigPhoneNo: "0987654321",
            kiwango: 200,
            accountNo: "Updated Account",
            nambaZaHisa: "Updated Hisa",
            kiasiChaHisa: "Updated Kiasi",
            interestOnLoans: 10,
        };
        await UpdateDaoDetails(mReq, mRes);
        expect(mRes.status).toHaveBeenCalledWith(404);
        expect(mRes.json).toHaveBeenCalledWith({ message: "Dao not found" });
  });

  it("successfully update Dao Details", async function () {
     //First create a test DAO in the Database
    const dummyDaoRepository = dataSource.getRepository(Dao);
    const dummyDao = new Dao();
    dummyDao.daoName = "Initial DAO"
    dummyDao.daoMultiSigAddr = "testAddress"
    dummyDao.daoLocation = "testlocation"
    dummyDao.targetAudience = "tester"
    dummyDao.daoTitle = "Tester"
    dummyDao.daoDescription = "Description"
    dummyDao.daoOverview = "Overviewtest"
    dummyDao.daoImageIpfsHash = "Hash"
    dummyDao.daoRegDocs = "Regdocs"
    dummyDao.multiSigPhoneNo = 1
    dummyDao.kiwango = 1
    dummyDao.accountNo = 20
    dummyDao.nambaZaHisa = 124
    dummyDao.interestOnLoans = 3

    const savedDao = await dummyDaoRepository.save(dummyDao);

    mReq.params = { multiSigAddr: "testAddress" };
    mReq.body = {
         daoName: "Updated DAO Name", // Update only the name
            daoLocation: "Updated Location",
            targetAudience: "Updated Audience",
            daoTitle: "Updated Title",
            daoDescription: "Updated Description",
            daoOverview: "Updated Overview",
            daoImageIpfsHash: "Updated Hash",
            daoRegDocs: "Updated Docs",
            multiSigPhoneNo: "0987654321",
            kiwango: 200,
            accountNo: "Updated Account",
            nambaZaHisa: "Updated Hisa",
            kiasiChaHisa: "Updated Kiasi",
            interestOnLoans: 10,
        };

        await UpdateDaoDetails(mReq, mRes);

        expect(mRes.status).toHaveBeenCalledWith(200);
        expect(mRes.json).toHaveBeenCalledWith({ message: "Dao details updated successfully " })

        //Verify the data in the database
        const updatedDao = await dummyDaoRepository.findOneBy({ daoMultiSigAddr: "testAddress" });
        expect(updatedDao).toBeDefined();
        expect(updatedDao?.daoName).toBe("Updated DAO Name");
        expect(updatedDao?.daoLocation).toBe("Updated Location");
  });
})

describe("FundDao (Integration Test)", () => {
    it("should return 400 for missing _daoMultiSig param", async () => {
        const mockRequest = mock<Request>();
        const mockResponse = mock<Response>();
        mockRequest.params = {};

        await FundDao(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Missing required url params" });
    });

    it("should return 400 for invalid fundAmount (<= 0)", async () => {
        const mockRequest = mock<Request>();
        const mockResponse = mock<Response>();
        mockRequest.params = { _daoMultiSig: "testAddress" };
        mockRequest.body = { funderAddr: "testFunder", fundAmount: 0 };

        await FundDao(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid fund amount" });

        mockRequest.body.fundAmount = -1;
        await FundDao(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid fund amount" });
    });

    it("should return 404 if DAO not found", async () => {
        const mockRequest = mock<Request>();
        const mockResponse = mock<Response>();
        mockRequest.params = { _daoMultiSig: "nonExistentAddress" };
        mockRequest.body = { funderAddr: "testFunder", fundAmount: 100 };

        await FundDao(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "DAO not found" });
    });

    it("should successfully process a fund request", async () => {
        const mockRequest = mock<Request>();
        const mockResponse = mock<Response>();

        // Create a test DAO in the database
        const daoRepository = dataSource.getRepository(Dao);
        const newDao = new Dao();
        newDao.daoName = "Initial DAO";
        newDao.daoMultiSigAddr = "testAddress";
                newDao.daoLocation="test" ;
                newDao.targetAudience="test";
                newDao.daoTitle="test";
                newDao.daoDescription="test";
                newDao.daoOverview="test";
                newDao.daoImageIpfsHash="test";
                newDao.daoRegDocs="test";
                newDao.multiSigPhoneNo=1;
                newDao.kiwango=1;
                newDao.accountNo=1;
                newDao.nambaZaHisa=1;
                newDao.kiasiChaHisa=1;
                newDao.interestOnLoans=1;
        await daoRepository.save(newDao);

        mockRequest.params = { _daoMultiSig: "testAddress" };
        mockRequest.body = { funderAddr: "testFunder", fundAmount: 100 };

        await FundDao(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "Funding successfully" });

        // Add more assertions here once you implement the actual funding logic
        // For example, you might want to check if the DAO's fund amount has been updated in the database
        // const updatedDao = await daoRepository.findOneBy({ daoMultiSigAddr: "testAddress" });
        // expect(updatedDao?.fundAmount).toBe(100);
    });
})
