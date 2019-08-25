import { createRequestFromCurl } from '../../utils/request';
import { Response } from '../entity';
import { RequestRepository } from '../repository';

interface Dependencies {
  requestRepository: RequestRepository;
  targetUrl: string;
}

export class ImportCurl {
  private requestRepository: RequestRepository;
  private targetUrl: string;

  public constructor({ requestRepository, targetUrl }: Dependencies) {
    this.requestRepository = requestRepository;
    this.targetUrl = targetUrl;
  }

  public async execute(curlCommand: string) {
    const request = createRequestFromCurl(curlCommand, this.targetUrl);

    await this.requestRepository.persistResponseForRequest(
      request,
      new Response(200, {}, Buffer.from(''), 0)
    );

    return request;
  }
}
