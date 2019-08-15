import { ResponseRepository } from '../repository';
import { NetworkService } from '../service';
import { Response, Request } from '../entity';
import { RefreshRequest } from './RefreshRequest';

let useCase: RefreshRequest;
let responseRepository: ResponseRepository;
let networkService: NetworkService;

beforeEach(() => {
  responseRepository = {
    getResponseForRequest: jest.fn().mockResolvedValue(null),
    persistResponseForRequest: jest.fn().mockResolvedValue(null),
    getAllRequests: jest.fn().mockResolvedValue([]),
    deleteAll: jest.fn().mockResolvedValue(null),
    deleteByRequestId: jest.fn().mockResolvedValue(null),
    getRequestById: jest
      .fn()
      .mockResolvedValue(
        new Request(
          'get',
          '/pokemon/pikachu',
          { authorization: 'Bearer token' },
          ''
        )
      ),
  };
  networkService = {
    executeRequest: jest
      .fn()
      .mockResolvedValue(
        new Response(200, { 'content-type': 'application/json' }, 'OK')
      ),
  };
  useCase = new RefreshRequest({ responseRepository, networkService });
});

it('should clear the request and refetch it', async () => {
  // Given
  const requestId = 'request-id';

  // When
  await useCase.execute(requestId);

  //Then
  expect(responseRepository.deleteByRequestId).toHaveBeenCalledTimes(1);
  expect(responseRepository.deleteByRequestId).toHaveBeenCalledWith(requestId);
  expect(responseRepository.persistResponseForRequest).toHaveBeenCalledTimes(1);
  expect(responseRepository.persistResponseForRequest).toHaveBeenCalledWith(
    new Request(
      'get',
      '/pokemon/pikachu',
      { authorization: 'Bearer token' },
      ''
    ),
    new Response(200, { 'content-type': 'application/json' }, 'OK')
  );
});

it('should throw an error when the request is not found', async () => {
  // Given
  expect.assertions(1);
  (responseRepository.getRequestById as jest.Mock).mockResolvedValue(null);
  const requestId = 'request-id';

  // When
  try {
    await useCase.execute(requestId);
  } catch (err) {
    //Then
    expect(err).toEqual(new Error('Request not found'));
  }
});
