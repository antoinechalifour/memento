import { getTestRequestRepository } from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { Request, Response } from '../entity';
import { GetRequestDetails } from './GetRequestDetails';

let useCase: GetRequestDetails;
let requestRepository: RequestRepository;

beforeEach(() => {
  requestRepository = getTestRequestRepository();

  useCase = new GetRequestDetails({ requestRepository });
});

it('should return a tuple with the request and the response', async () => {
  // Given
  const requestId = 'request-id';
  const request = new Request('GET', '/test', {}, '');
  const response = new Response(201, {}, 'Hello world', 66);

  (requestRepository.getRequestById as jest.Mock).mockResolvedValue(request);
  (requestRepository.getResponseByRequestId as jest.Mock).mockResolvedValue(
    response
  );

  // When
  const result = await useCase.execute(requestId);

  //Then
  expect(result).toEqual([request, response]);
  expect(requestRepository.getRequestById).toHaveBeenCalledTimes(1);
  expect(requestRepository.getRequestById).toHaveBeenCalledWith(requestId);
  expect(requestRepository.getResponseByRequestId).toHaveBeenCalledTimes(1);
  expect(requestRepository.getResponseByRequestId).toHaveBeenCalledWith(
    requestId
  );
});

it('should throw when the request is not found', async () => {
  expect.assertions(1);

  // Given
  (requestRepository.getRequestById as jest.Mock).mockResolvedValue(null);

  // When
  try {
    await useCase.execute('');
  } catch (err) {
    // Then
    expect(err).toEqual(new Error('Request not found'));
  }
});

it('should throw when the response is not found', async () => {
  expect.assertions(1);

  // Given
  const request = new Request('GET', '/test', {}, '');
  (requestRepository.getRequestById as jest.Mock).mockResolvedValue(request);
  (requestRepository.getResponseByRequestId as jest.Mock).mockResolvedValue(
    null
  );

  // When
  try {
    await useCase.execute('');
  } catch (err) {
    // Then
    expect(err).toEqual(new Error('Response not found'));
  }
});
