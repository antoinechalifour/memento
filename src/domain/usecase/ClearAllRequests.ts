import { ResponseRepository } from '../repository';

interface Dependencies {
  responseRepository: ResponseRepository;
}

export class ClearAllRequests {
  private responseRepository: ResponseRepository;

  public constructor({ responseRepository }: Dependencies) {
    this.responseRepository = responseRepository;
  }

  public async execute() {
    await this.responseRepository.deleteAll();
  }
}
