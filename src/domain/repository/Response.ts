import { Request, Response } from '../entity';

export interface ResponseRepository {
  getResponseForRequest(request: Request): Promise<Response | null>;

  persistResponseForRequest(
    request: Request,
    response: Response
  ): Promise<void>;
}

export interface ResponseRepositoryConstructor {
  new (...args: any[]): ResponseRepository; // eslint-disable-line @typescript-eslint/no-explicit-any
}
