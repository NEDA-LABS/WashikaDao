import { Request, Response } from 'express';
import { CreateNewDao } from '../controller/DaoController';
import * as dataSource from '../data-source'; // Import as namespace
import { Dao } from '../entity/Dao';
import { MemberDetails } from '../entity/MemberDetails';

describe('DaoController', () => {
  describe('CreateNewDao', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockDaoRepository: any;
    let mockMemberDetailsRepository: any;

    beforeEach(() => {
      mockRequest = { body: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockDaoRepository = { findOne: jest.fn(), save: jest.fn() };
      mockMemberDetailsRepository = { save: jest.fn() };

      // Correct and SIMPLE mocking of getRepository
      jest.spyOn(dataSource.AppDataSource, 'getRepository').mockImplementation((entity) => {
        if (entity === Dao) return mockDaoRepository;
        if (entity === MemberDetails) return mockMemberDetailsRepository;
        return {}; // Very important: Return an empty object for unknown entities
      });
    });

    afterEach(() => {
      jest.restoreAllMocks(); // Essential for clean tests
    });

    it('should call status with 400 when required fields are missing', async () => {
      await CreateNewDao(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Missing required DAO details" });
    });
  });
});