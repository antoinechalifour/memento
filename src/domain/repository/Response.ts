import { Request, Response } from '../entity';

export interface ResponseRepository {
  getRequestById(requestId: string): Promise<Request | null>;

  getAllRequests(): Promise<Request[]>;

  getResponseForRequest(request: Request): Promise<Response | null>;

  persistResponseForRequest(
    request: Request,
    response: Response
  ): Promise<void>;

  deleteAll(): Promise<void>;

  deleteByRequestId(requestId: string): Promise<void>;
}

export interface ResponseRepositoryConstructor {
  new (...args: any[]): ResponseRepository; // eslint-disable-line @typescript-eslint/no-explicit-any
}
