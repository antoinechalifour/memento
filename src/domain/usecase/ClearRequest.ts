import { ResponseRepository } from '../repository';

interface Dependencies {
  responseRepository: ResponseRepository;
}

export class ClearRequest {
  private responseRepository: ResponseRepository;

  public constructor({ responseRepository }: Dependencies) {
    this.responseRepository = responseRepository;
  }

  public async execute(requestId: string) {
    await this.responseRepository.deleteByRequestId(requestId);
  }
}
