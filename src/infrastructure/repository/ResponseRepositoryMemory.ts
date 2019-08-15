import { ResponseRepository } from '../../domain/repository';
import { Request, Response } from '../../domain/entity';

export class ResponseRepositoryMemory implements ResponseRepository {
  private static _db: Map<string, [Request, Response]> = new Map();

  public async getResponseForRequest(request: Request) {
    const cachedResponse =
      ResponseRepositoryMemory._db.get(request.getComputedId()) || null;

    if (!cachedResponse) {
      return null;
    }

    return Promise.resolve(cachedResponse[1]);
  }

  public async persistResponseForRequest(request: Request, response: Response) {
    ResponseRepositoryMemory._db.set(request.getComputedId(), [
      request,
      response,
    ]);
  }

  public async getAllRequests() {
    return [...ResponseRepositoryMemory._db.values()].map(entry => entry[0]);
  }

  public async getRequestById(requestId: string) {
    const tuple = ResponseRepositoryMemory._db.get(requestId);

    if (tuple) {
      return tuple[0];
    }

    return null;
  }

  public async deleteAll() {
    ResponseRepositoryMemory._db = new Map();
  }

  public async deleteByRequestId(requestId: string) {
    ResponseRepositoryMemory._db.delete(requestId);
  }
}
