import axios, { AxiosResponse } from 'axios';

import { logger } from '../../util/logger';
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
    const axiosResponse = await axios({
      data: request.body,
      url: `${this.targetUrl}${request.url}`,
      headers: request.headers,
      method: request.method,
      transformResponse: (data: string) => data,
    }).catch(error => {
      if (!error.response) {
        logger.error(`Unexpected error from ${this.targetUrl}${request.url}`);
        throw error;
      }

      return error.response as AxiosResponse;
    });

    return new Response(
      axiosResponse.status,
      axiosResponse.headers,
      axiosResponse.data
    );
  }
}
