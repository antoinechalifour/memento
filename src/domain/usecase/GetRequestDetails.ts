import { RequestRepository } from '../repository';
import { Request, Response } from '../entity';

interface Dependencies {
  requestRepository: RequestRepository;
}

export class GetRequestDetails {
  private requestRepository: RequestRepository;

  public constructor({ requestRepository }: Dependencies) {
    this.requestRepository = requestRepository;
  }

  public async execute(requestId: string): Promise<[Request, Response]> {
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

    return [request, response];
  }
}
