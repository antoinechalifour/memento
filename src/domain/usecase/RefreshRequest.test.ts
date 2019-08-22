import {
  getTestRequestRepository,
  getTestNetworkService,
} from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { NetworkService } from '../service';
import { Response, Request } from '../entity';
import { RefreshRequest } from './RefreshRequest';

let useCase: RefreshRequest;
let requestRepository: RequestRepository;
let networkService: NetworkService;

beforeEach(() => {
  requestRepository = getTestRequestRepository();
  (requestRepository.getRequestById as jest.Mock).mockResolvedValue(
    new Request(
      'get',
      '/pokemon/pikachu',
      { authorization: 'Bearer token' },
      ''
    )
  );

  networkService = getTestNetworkService();
  (networkService.executeRequest as jest.Mock).mockResolvedValue(
    new Response(200, { 'content-type': 'application/json' }, 'OK', 66)
  );

  useCase = new RefreshRequest({ requestRepository, networkService });
});

it('should clear the request and refetch it', async () => {
  // Given
  const requestId = 'request-id';

  // When
  await useCase.execute(requestId);

  //Then
  expect(requestRepository.deleteByRequestId).toHaveBeenCalledTimes(1);
  expect(requestRepository.deleteByRequestId).toHaveBeenCalledWith(requestId);
  expect(requestRepository.persistResponseForRequest).toHaveBeenCalledTimes(1);
  expect(requestRepository.persistResponseForRequest).toHaveBeenCalledWith(
    new Request(
      'get',
      '/pokemon/pikachu',
      { authorization: 'Bearer token' },
      ''
    ),
    new Response(200, { 'content-type': 'application/json' }, 'OK', 66)
  );
});

it('should throw an error when the request is not found', async () => {
  // Given
  expect.assertions(1);
  (requestRepository.getRequestById as jest.Mock).mockResolvedValue(null);
  const requestId = 'request-id';

  // When
  try {
    await useCase.execute(requestId);
  } catch (err) {
    //Then
    expect(err).toEqual(new Error('Request not found'));
  }
});
