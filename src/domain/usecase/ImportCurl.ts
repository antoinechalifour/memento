import { createRequestFromCurl } from '../../utils/request';
import { MementoConfiguration } from '../../configuration';
import { Response } from '../entity';
import { RequestRepository } from '../repository';

interface Dependencies {
  config: MementoConfiguration;
  requestRepository: RequestRepository;
}

export class ImportCurl {
  private config: MementoConfiguration;
  private requestRepository: RequestRepository;

  public constructor({ requestRepository, config }: Dependencies) {
    this.requestRepository = requestRepository;
    this.config = config;
  }

  public async execute(curlCommand: string) {
    const request = createRequestFromCurl(curlCommand, this.config.targetUrl);

    await this.requestRepository.persistResponseForRequest(
      request,
      new Response(200, {}, Buffer.from(''), 0)
    );

    return request;
  }
}
