import { logger } from '../../util/logger';
import { wait } from '../../util/timers';

import { Method, Response, Request } from '../entity';
import { ResponseRepository } from '../repository';
import { NetworkService } from '../service';

interface Dependencies {
  responseRepository: ResponseRepository;
  networkService: NetworkService;
  delay: number;
}

export interface Headers {
  [key: string]: string;
}

export class RespondToRequest {
  private responseRepository: ResponseRepository;
  private networkService: NetworkService;
  private delay: number;

  public constructor({
    responseRepository,
    networkService,
    delay,
  }: Dependencies) {
    this.responseRepository = responseRepository;
    this.networkService = networkService;
    this.delay = delay;
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
    let response: Response;

    if (cachedResponse) {
      response = cachedResponse;
      logger.debug('Using response from the cache');
    } else {
      logger.debug('Fetching response from the network');
      response = await this.networkService.executeRequest(request);

      await this.responseRepository.persistResponseForRequest(
        request,
        response
      );
    }

    await wait(this.delay);

    return response;
  }
}
