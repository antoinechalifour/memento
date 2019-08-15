import { ResponseRepository } from '../repository';
import { ClearAllRequests } from './ClearAllRequests';

let useCase: ClearAllRequests;
let responseRepository: ResponseRepository;

beforeEach(() => {
  responseRepository = {
    getResponseForRequest: jest.fn().mockResolvedValue(null),
    persistResponseForRequest: jest.fn().mockResolvedValue(null),
    getAllRequests: jest.fn().mockResolvedValue([]),
    deleteAll: jest.fn().mockResolvedValue(null),
    deleteByRequestId: jest.fn().mockResolvedValue(null),
    getRequestById: jest.fn().mockResolvedValue(null),
  };
  useCase = new ClearAllRequests({ responseRepository });
});

it('should clear all the requests', async () => {
  // When
  await useCase.execute();

  //Then
  expect(responseRepository.deleteAll).toHaveBeenCalledTimes(1);
});
