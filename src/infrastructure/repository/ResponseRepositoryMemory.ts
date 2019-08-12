import { ResponseRepository } from '../../domain/repository';
import { Request, Response } from '../../domain/entity';

export class ResponseRepositoryMemory implements ResponseRepository {
  private static _db: Map<string, Response> = new Map();

  public async getResponseForRequest(request: Request) {
    const cachedResponse =
      ResponseRepositoryMemory._db.get(request.getComputedId()) || null;

    return Promise.resolve(cachedResponse);
  }

  public async persistResponseForRequest(request: Request, response: Response) {
    ResponseRepositoryMemory._db.set(request.getComputedId(), response);
  }
}
