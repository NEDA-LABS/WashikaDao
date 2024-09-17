// Unit test for CreateNewDao function
import { Request, Response } from 'express';
import { CreateNewDao } from '../src/controller/DaoController'; // Import the correct path to the DaoController file
import { DaoRepositoryMock, MemberDetailsRepositoryMock } from './mocks';

const mockRequest = (body: any): Request => {
  return {
    body,
    params: {},
  } as unknown as Request;
};

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('CreateNewDao function', () => {
  it('should create a new DAO and save member details', async () => {
    const daoRepository = new DaoRepositoryMock();
    const memberDetailsRepository = new MemberDetailsRepositoryMock();
    const req = mockRequest({
      _daoName: 'Test DAO',
      _daoLocation: 'Test Location',
      _targetAudience: 'Test Audience',
      _daoTitle: 'Test Title',
      _daoDescription: 'Test Description',
      _daoOverview: 'Test Overview',
      _daoImageIpfsHash: 'Test Image Hash',
      _multiSigAddr: 'Test MultiSig',
      _memberName: 'Test Member',
      _phoneNo: 'Test Phone',
      _nationalIdNo: 'Test National ID',
      _memberRole: 'Owner',
      _daoMultiSig: 'Test MultiSig',
    });
    const res = mockResponse();

    await CreateNewDao(req, res);

    expect(daoRepository.save).toHaveBeenCalledTimes(1);
    expect(memberDetailsRepository.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'DAO created successfully' });
  });

  it('should return 400 status if required DAO details are missing', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await CreateNewDao(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required Dao Details' });
  });

  it('should return 400 status if required member details are missing', async () => {
    const req = mockRequest({
      _daoName: 'Test DAO',
      _daoLocation: 'Test Location',
      _targetAudience: 'Test Audience',
      _daoTitle: 'Test Title',
      _daoDescription: 'Test Description',
      _daoOverview: 'Test Overview',
      _daoImageIpfsHash: 'Test Image Hash',
      _multiSigAddr: 'Test MultiSig',
    });
    const res = mockResponse();

    await CreateNewDao(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required Member Details' });
  });
});