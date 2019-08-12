import { logger } from '../../util/logger';

import { Method, Response, Request } from '../entity';
import { ResponseRepository } from '../repository';
import { NetworkService } from '../service';

interface Dependencies {
  responseRepository: ResponseRepository;
  networkService: NetworkService;
}

export interface Headers {
  [key: string]: string;
}

export class RespondToRequest {
  private responseRepository: ResponseRepository;
  private networkService: NetworkService;

  public constructor({ responseRepository, networkService }: Dependencies) {
    this.responseRepository = responseRepository;
    this.networkService = networkService;
  }

  public async execute(
    method: Method,
    url: string,
    headers: Headers,
    body: string
  ): Promise<Response> {
    const request = new Request(method, url, headers, body);

    const cachedResponse = await this.responseRepository.getResponseForRequest(
      request
    );

    if (cachedResponse) {
      logger.debug('Using response from the cache');
      return cachedResponse;
    }

    logger.debug('Fetching response from the network');
    const response = await this.networkService.executeRequest(request);

    await this.responseRepository.persistResponseForRequest(request, response);

    return response;
  }
}
