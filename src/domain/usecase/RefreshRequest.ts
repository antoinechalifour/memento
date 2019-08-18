import { RequestRepository } from '../repository';
import { NetworkService } from '../service';

interface Dependencies {
  requestRepository: RequestRepository;
  networkService: NetworkService;
}

export class RefreshRequest {
  private requestRepository: RequestRepository;
  private networkService: NetworkService;

  public constructor({ requestRepository, networkService }: Dependencies) {
    this.requestRepository = requestRepository;
    this.networkService = networkService;
  }

  public async execute(requestId: string) {
    const request = await this.requestRepository.getRequestById(requestId);

    if (!request) {
      throw new Error('Request not found');
    }

    await this.requestRepository.deleteByRequestId(requestId);

    const response = await this.networkService.executeRequest(request);
    await this.requestRepository.persistResponseForRequest(request, response);
  }
}
