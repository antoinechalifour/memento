import { ResponseRepository } from '../repository';

interface Dependencies {
  responseRepository: ResponseRepository;
}

export class ListRequest {
  private responseRepository: ResponseRepository;

  public constructor({ responseRepository }: Dependencies) {
    this.responseRepository = responseRepository;
  }

  public execute() {
    return this.responseRepository.getAllRequests();
  }
}
