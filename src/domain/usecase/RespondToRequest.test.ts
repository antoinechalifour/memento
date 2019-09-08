import { getTestConfiguration } from '../../test-utils/config';
import {
  getTestRequestRepository,
  getTestNetworkService,
} from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { NetworkService } from '../service';
import { Response, Request } from '../entity';
import { wait } from '../../utils/timers';
import { RespondToRequest } from './RespondToRequest';

jest.mock('../../utils/timers');

let requestRepository: RequestRepository;
let networkService: NetworkService;

beforeEach(() => {
  (wait as jest.Mock).mockReset();
  requestRepository = getTestRequestRepository();
  networkService = getTestNetworkService();
});

describe('when the response is in the cache', () => {
  beforeEach(() => {
    (requestRepository.getResponseByRequestId as jest.Mock).mockResolvedValue(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not simulate the response time when useRealResponseTime is set to false', async () => {
    // Given
    const useCase = new RespondToRequest({
      requestRepository,
      networkService,
      config: getTestConfiguration({ useRealResponseTime: false }),
    });
    const method = 'GET';
    const url = '/beers/1';
    const headers = { authorization: 'Bearer token' };
    const body = 'beer information';

    // When
    await useCase.execute(method, url, headers, body);

    //Then
    expect(wait).not.toHaveBeenCalled();
  });

  it('should return the response from the cache, without using the network', async () => {
    // Given
    const useCase = new RespondToRequest({
      requestRepository,
      networkService,
      config: getTestConfiguration({ useRealResponseTime: true }),
    });
    const method = 'GET';
    const url = '/beers/1';
    const headers = { authorization: 'Bearer token' };
    const body = 'beer information';

    // When
    const response = await useCase.execute(method, url, headers, body);

    //Then
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );

    expect(requestRepository.getResponseByRequestId).toHaveBeenCalledTimes(1);
    expect(requestRepository.getResponseByRequestId).toHaveBeenCalledWith(
      new Request(method, url, headers, body).id
    );

    expect(wait).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith(66);

    expect(networkService.executeRequest).not.toHaveBeenCalled();
  });
});

describe('when no response is in the cache', () => {
  beforeEach(() => {
    (requestRepository.getResponseByRequestId as jest.Mock).mockResolvedValue(
      null
    );
    (networkService.executeRequest as jest.Mock).mockResolvedValue(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should fetch the reponse from the network and store it in the cache', async () => {
    const useCase = new RespondToRequest({
      requestRepository,
      networkService,
      config: getTestConfiguration({
        useRealResponseTime: true,
        disableCachingPatterns: [
          {
            method: 'POST',
            urlPattern: '/beers/1',
          },
        ],
      }),
    });
    const method = 'GET';
    const url = '/beers/1';
    const headers = { authorization: 'Bearer token' };
    const body = 'beer information';

    // When
    const response = await useCase.execute(method, url, headers, body);

    //Then
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );

    expect(networkService.executeRequest).toHaveBeenCalledTimes(1);
    expect(networkService.executeRequest).toHaveBeenCalledWith(
      new Request(method, url, headers, body)
    );

    expect(wait).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith(66);

    expect(requestRepository.persistResponseForRequest).toHaveBeenCalledTimes(
      1
    );
    expect(requestRepository.persistResponseForRequest).toHaveBeenCalledWith(
      new Request(method, url, headers, body),
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });
});

describe('when caching is disabled for the method and url', () => {
  beforeEach(() => {
    (networkService.executeRequest as jest.Mock).mockResolvedValue(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not cache the response (1 matching pattern)', async () => {
    // Given
    const useCase = new RespondToRequest({
      networkService,
      requestRepository,
      config: getTestConfiguration({
        disableCachingPatterns: [
          {
            method: 'post',
            urlPattern: '/pokemon/ditto',
          },
        ],
      }),
    });
    const method = 'POST';
    const url = '/pokemon/ditto';

    // When
    const response = await useCase.execute(method, url, {}, '');

    //Then
    expect(requestRepository.persistResponseForRequest).not.toHaveBeenCalled();
    expect(requestRepository.getResponseByRequestId).not.toHaveBeenCalled();
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not cache the response (3 patterns / 1 matching pattern)', async () => {
    // Given
    const useCase = new RespondToRequest({
      networkService,
      requestRepository,
      config: getTestConfiguration({
        disableCachingPatterns: [
          {
            method: 'POST',
            urlPattern: '/pokemon/ditto',
          },
          {
            method: 'get',
            urlPattern: '/pokemon/ditto',
          },
          {
            method: 'post',
            urlPattern: '/pokemon/ditto?format=true',
          },
        ],
      }),
    });
    const method = 'POST';
    const url = '/pokemon/ditto';

    // When
    const response = await useCase.execute(method, url, {}, '');

    //Then
    expect(requestRepository.persistResponseForRequest).not.toHaveBeenCalled();
    expect(requestRepository.getResponseByRequestId).not.toHaveBeenCalled();
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not cache the response (glob style)', async () => {
    // Given
    const useCase = new RespondToRequest({
      networkService,
      requestRepository,
      config: getTestConfiguration({
        disableCachingPatterns: [
          {
            method: 'post',
            urlPattern: '/pokemon/ditto*',
          },
        ],
      }),
    });
    const method = 'POST';
    const url = '/pokemon/ditto?format=true';

    // When
    const response = await useCase.execute(method, url, {}, '');

    //Then
    expect(requestRepository.persistResponseForRequest).not.toHaveBeenCalled();
    expect(requestRepository.getResponseByRequestId).not.toHaveBeenCalled();
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not cache the response (glob style)', async () => {
    // Given
    const useCase = new RespondToRequest({
      networkService,
      requestRepository,
      config: getTestConfiguration({
        disableCachingPatterns: [
          {
            method: 'get',
            urlPattern: '/pokemon/mew',
          },
        ],
      }),
    });
    const method = 'GET';
    const url = '/pokemon/mew/';

    // When
    const response = await useCase.execute(method, url, {}, '');

    //Then
    expect(requestRepository.persistResponseForRequest).not.toHaveBeenCalled();
    expect(requestRepository.getResponseByRequestId).not.toHaveBeenCalled();
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not cache the response (nested route)', async () => {
    // Given
    const useCase = new RespondToRequest({
      networkService,
      requestRepository,
      config: getTestConfiguration({
        disableCachingPatterns: [
          {
            method: 'get',
            urlPattern: '/pokemon/mew/**/*',
          },
        ],
      }),
    });
    const method = 'GET';
    const url = '/pokemon/mew/abilities/2/stats';

    // When
    const response = await useCase.execute(method, url, {}, '');

    //Then
    expect(requestRepository.persistResponseForRequest).not.toHaveBeenCalled();
    expect(requestRepository.getResponseByRequestId).not.toHaveBeenCalled();
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });

  it('should not cache the response (nested route)', async () => {
    // Given
    const useCase = new RespondToRequest({
      networkService,
      requestRepository,
      config: getTestConfiguration({
        disableCachingPatterns: [
          {
            method: 'get',
            urlPattern: '/pokemon/*/sprites/**',
          },
          {
            method: 'post',
            urlPattern: '/pokemon/*/sprites/**',
          },
        ],
      }),
    });
    const method = 'GET';
    const url = '/pokemon/mew/sprites/2/back';

    // When
    const response = await useCase.execute(method, url, {}, '');

    //Then
    expect(requestRepository.persistResponseForRequest).not.toHaveBeenCalled();
    expect(requestRepository.getResponseByRequestId).not.toHaveBeenCalled();
    expect(response).toEqual(
      new Response(
        200,
        { 'cache-control': 'something' },
        Buffer.from('some body'),
        66
      )
    );
  });
});
