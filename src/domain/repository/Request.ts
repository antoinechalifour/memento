import { Request, Response } from '../entity';

export interface RequestRepository {
  getRequestById(requestId: string): Promise<Request | null>;

  getAllRequests(): Promise<Request[]>;

  getResponseByRequestId(requestId: string): Promise<Response | null>;

  persistResponseForRequest(
    request: Request,
    response: Response
  ): Promise<void>;

  deleteAll(): Promise<void>;

  deleteByRequestId(requestId: string): Promise<void>;
}
