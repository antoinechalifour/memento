import { RequestRepository } from '../repository';

interface Dependencies {
  requestRepository: RequestRepository;
}

export class ListRequest {
  private requestRepository: RequestRepository;

  public constructor({ requestRepository }: Dependencies) {
    this.requestRepository = requestRepository;
  }

  public execute() {
    return this.requestRepository.getAllRequests();
  }
}
