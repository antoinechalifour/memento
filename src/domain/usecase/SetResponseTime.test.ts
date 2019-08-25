import { getTestRequestRepository } from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { Request, Response } from '../entity';
import { SetResponseTime } from './SetResponseTime';

let requestRepository: RequestRepository;

beforeEach(() => {
  requestRepository = getTestRequestRepository();
});

describe('when the request is not found', () => {
  it('should throw an error', async () => {
    expect.assertions(1);

    // Given
    (requestRepository.getRequestById as jest.Mock).mockResolvedValue(null);

    const useCase = new SetResponseTime({ requestRepository });

    // When
    try {
      await useCase.execute('', 0);
    } catch (err) {
      //Then
      expect(err).toEqual(new Error('Request not found'));
    }
  });
});

describe('when the request is found', () => {
  it('should set the response time', async () => {
    // Given
    const request = new Request('PUT', '/put', {}, '');
    const response = new Response(
      201,
      { 'content-type': 'text/plain' },
      Buffer.from('Hello world'),
      66
    );
    (requestRepository.getRequestById as jest.Mock).mockResolvedValue(request);
    (requestRepository.getResponseByRequestId as jest.Mock).mockResolvedValue(
      response
    );

    const requestId = 'request-id';
    const responseTime = 666;
    const useCase = new SetResponseTime({ requestRepository });

    // When
    await useCase.execute(requestId, responseTime);

    //Then
    expect(requestRepository.persistResponseForRequest).toHaveBeenCalledTimes(
      1
    );
    expect(requestRepository.persistResponseForRequest).toHaveBeenCalledWith(
      request,
      new Response(
        201,
        { 'content-type': 'text/plain' },
        Buffer.from('Hello world'),
        666
      )
    );
  });
});
