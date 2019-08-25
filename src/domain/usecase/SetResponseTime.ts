import { RequestRepository } from '../repository';

interface Depenencies {
  requestRepository: RequestRepository;
}

export class SetResponseTime {
  private requestRepository: RequestRepository;

  public constructor({ requestRepository }: Depenencies) {
    this.requestRepository = requestRepository;
  }

  public async execute(requestId: string, responseTimeInMs: number) {
    const [request, response] = await Promise.all([
      this.requestRepository.getRequestById(requestId),
      this.requestRepository.getResponseByRequestId(requestId),
    ]);

    if (!request) {
      throw new Error('Request not found');
    }

    if (!response) {
      throw new Error('Response not found');
    }

    response.responseTimeInMs = responseTimeInMs;

    return this.requestRepository.persistResponseForRequest(request, response);
  }
}
