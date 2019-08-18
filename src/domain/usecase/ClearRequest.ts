import { RequestRepository } from '../repository';

interface Dependencies {
  requestRepository: RequestRepository;
}

export class ClearRequest {
  private requestRepository: RequestRepository;

  public constructor({ requestRepository }: Dependencies) {
    this.requestRepository = requestRepository;
  }

  public async execute(requestId: string) {
    await this.requestRepository.deleteByRequestId(requestId);
  }
}
