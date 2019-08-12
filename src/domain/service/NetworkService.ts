import { Request, Response } from '../entity';

export interface NetworkService {
  executeRequest(request: Request): Promise<Response>;
}
