import { RequestRepository } from '../repository';

interface Dependencies {
  requestRepository: RequestRepository;
}

export class ClearAllRequests {
  private requestRepository: RequestRepository;

  public constructor({ requestRepository }: Dependencies) {
    this.requestRepository = requestRepository;
  }

  public async execute() {
    await this.requestRepository.deleteAll();
  }
}
