import { ResponseRepository } from '../repository';
import { ClearRequest } from './ClearRequest';

let useCase: ClearRequest;
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

  useCase = new ClearRequest({ responseRepository });
});

it('should delete the request', async () => {
  // Given
  const requestId = 'request-id';

  // When
  await useCase.execute(requestId);

  //Then
  expect(responseRepository.deleteByRequestId).toHaveBeenCalledTimes(1);
  expect(responseRepository.deleteByRequestId).toHaveBeenCalledWith(requestId);
});
