import { RequestRepository } from '../domain/repository';
import { NetworkService } from '../domain/service';

export function getTestRequestRepository(): RequestRepository {
  return {
    getResponseByRequestId: jest.fn().mockResolvedValue(null),
    persistResponseForRequest: jest.fn().mockResolvedValue(null),
    getAllRequests: jest.fn().mockResolvedValue([]),
    deleteAll: jest.fn().mockResolvedValue(null),
    deleteByRequestId: jest.fn().mockResolvedValue(null),
    getRequestById: jest.fn().mockResolvedValue(null),
  };
}

export function getTestNetworkService(): NetworkService {
  return {
    executeRequest: jest.fn().mockResolvedValue(null),
  };
}
