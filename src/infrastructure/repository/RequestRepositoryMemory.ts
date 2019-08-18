/* istanbul ignore file */

import { RequestRepository } from '../../domain/repository';
import { Request, Response } from '../../domain/entity';

export class RequestRepositoryMemory implements RequestRepository {
  private static _db: Map<string, [Request, Response]> = new Map();

  public async getResponseByRequestId(requestId: string) {
    const cachedResponse = RequestRepositoryMemory._db.get(requestId) || null;

    if (!cachedResponse) {
      return null;
    }

    return Promise.resolve(cachedResponse[1]);
  }

  public async persistResponseForRequest(request: Request, response: Response) {
    RequestRepositoryMemory._db.set(request.id, [request, response]);
  }

  public async getAllRequests() {
    return [...RequestRepositoryMemory._db.values()].map(entry => entry[0]);
  }

  public async getRequestById(requestId: string) {
    const tuple = RequestRepositoryMemory._db.get(requestId);

    if (tuple) {
      return tuple[0];
    }

    return null;
  }

  public async deleteAll() {
    RequestRepositoryMemory._db = new Map();
  }

  public async deleteByRequestId(requestId: string) {
    RequestRepositoryMemory._db.delete(requestId);
  }
}
