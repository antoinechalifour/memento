import axios, { AxiosResponse } from 'axios';

import { NetworkService } from '../../domain/service';
import { Request, Response } from '../../domain/entity';

interface Dependencies {
  targetUrl: string;
}

export class NetworkServiceAxios implements NetworkService {
  private targetUrl: string;

  public constructor({ targetUrl }: Dependencies) {
    this.targetUrl = targetUrl;
  }

  public async executeRequest(request: Request): Promise<Response> {
    const dateBefore = new Date();
    let dateAfter: Date;
    let axiosResponse: AxiosResponse<any>;

    try {
      axiosResponse = await axios({
        data: request.body,
        url: `${this.targetUrl}${request.url}`,
        headers: request.headers,
        method: request.method,
        transformResponse: (data: string) => data,
      });
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      axiosResponse = error.response;
    } finally {
      dateAfter = new Date();
    }

    const responseTime = dateAfter.getTime() - dateBefore.getTime();

    return new Response(
      axiosResponse.status,
      axiosResponse.headers,
      axiosResponse.data,
      responseTime
    );
  }
}
