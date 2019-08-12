import { Request, Response } from '../entity';

export interface ResponseRepository {
  getResponseForRequest(request: Request): Promise<Response | null>;

  persistResponseForRequest(
    request: Request,
    response: Response
  ): Promise<void>;
}
