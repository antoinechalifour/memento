import { ResponseRepository } from '../repository';
import { NetworkService } from '../service';

interface Dependencies {
  responseRepository: ResponseRepository;
  networkService: NetworkService;
}

export class RefreshRequest {
  private responseRepository: ResponseRepository;
  private networkService: NetworkService;

  public constructor({ responseRepository, networkService }: Dependencies) {
    this.responseRepository = responseRepository;
    this.networkService = networkService;
  }

  public async execute(requestId: string) {
    const request = await this.responseRepository.getRequestById(requestId);

    if (!request) {
      throw new Error('Request not found');
    }

    await this.responseRepository.deleteByRequestId(requestId);

    const response = await this.networkService.executeRequest(request);
    await this.responseRepository.persistResponseForRequest(request, response);
  }
}
