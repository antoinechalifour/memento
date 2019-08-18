import { wait } from '../../util/timers';

import { Method, Response, Request } from '../entity';
import { RequestRepository } from '../repository';
import { NetworkService } from '../service';

interface Dependencies {
  requestRepository: RequestRepository;
  networkService: NetworkService;
  delay: number;
}

export interface Headers {
  [key: string]: string;
}

export class RespondToRequest {
  private requestRepository: RequestRepository;
  private networkService: NetworkService;
  private delay: number;

  public constructor({
    requestRepository,
    networkService,
    delay,
  }: Dependencies) {
    this.requestRepository = requestRepository;
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

    const cachedResponse = await this.requestRepository.getResponseByRequestId(
      request.id
    );
    let response: Response;

    if (cachedResponse) {
      response = cachedResponse;
    } else {
      response = await this.networkService.executeRequest(request);

      await this.requestRepository.persistResponseForRequest(request, response);
    }

    await wait(this.delay);

    return response;
  }
}
