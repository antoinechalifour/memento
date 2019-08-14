import { ResponseRepository } from '../repository';
import { NetworkService } from '../service';

import { Response, Request } from '../entity';
import { RespondToRequest } from './RespondToRequest';
import { wait } from '../../util/timers';

jest.mock('../../util/timers');

let responseRepository: ResponseRepository;
let networkService: NetworkService;

beforeEach(() => {
  (wait as jest.Mock).mockReset();
  responseRepository = {
    getResponseForRequest: jest.fn().mockResolvedValue(null),
    persistResponseForRequest: jest.fn().mockResolvedValue(null),
  };
  networkService = {
    executeRequest: jest.fn().mockResolvedValue(null),
  };
});

describe('when the response is in the cache', () => {
  beforeEach(() => {
    (responseRepository.getResponseForRequest as jest.Mock).mockResolvedValue(
      new Response(200, { 'cache-control': 'something' }, 'some body')
    );
  });

  it('should return the response from the cache, without using the network', async () => {
    // Given
    const delay = 1000;
    const useCase = new RespondToRequest({
      responseRepository,
      networkService,
      delay,
    });
    const method = 'GET';
    const url = '/beers/1';
    const headers = { authorization: 'Bearer token' };
    const body = 'beer information';

    // When
    const response = await useCase.execute(method, url, headers, body);

    //Then
    expect(response).toEqual(
      new Response(200, { 'cache-control': 'something' }, 'some body')
    );

    expect(responseRepository.getResponseForRequest).toHaveBeenCalledTimes(1);
    expect(responseRepository.getResponseForRequest).toHaveBeenCalledWith(
      new Request(method, url, headers, body)
    );
    expect(wait).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith(1000);

    expect(networkService.executeRequest).not.toHaveBeenCalled();
  });
});

describe('when no response is in the cache', () => {
  beforeEach(() => {
    (responseRepository.getResponseForRequest as jest.Mock).mockResolvedValue(
      null
    );
    (networkService.executeRequest as jest.Mock).mockResolvedValue(
      new Response(200, { 'cache-control': 'something' }, 'some body')
    );
  });

  it('should fetch the reponse from the network and store it in the cache', async () => {
    const delay = 1000;
    const useCase = new RespondToRequest({
      responseRepository,
      networkService,
      delay,
    });
    const method = 'GET';
    const url = '/beers/1';
    const headers = { authorization: 'Bearer token' };
    const body = 'beer information';

    // When
    const response = await useCase.execute(method, url, headers, body);

    //Then
    expect(response).toEqual(
      new Response(200, { 'cache-control': 'something' }, 'some body')
    );

    expect(networkService.executeRequest).toHaveBeenCalledTimes(1);
    expect(networkService.executeRequest).toHaveBeenCalledWith(
      new Request(method, url, headers, body)
    );

    expect(responseRepository.persistResponseForRequest).toHaveBeenCalledTimes(
      1
    );
    expect(responseRepository.persistResponseForRequest).toHaveBeenCalledWith(
      new Request(method, url, headers, body),
      new Response(200, { 'cache-control': 'something' }, 'some body')
    );

    expect(wait).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith(1000);
  });
});
