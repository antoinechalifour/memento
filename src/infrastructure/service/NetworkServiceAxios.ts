import axios, { AxiosResponse } from 'axios';

import { logger } from '../../util/logger';
import { NetworkService } from '../../domain/service';
import { Request, Response } from '../../domain/entity';

interface Dependencies {
  targetUrl: string;
  delay: number;
}

export class NetworkServiceAxios implements NetworkService {
  private targetUrl: string;
  private delay: number;

  public constructor({ targetUrl, delay }: Dependencies) {
    this.targetUrl = targetUrl;
    this.delay = delay;
  }

  public async executeRequest(request: Request): Promise<Response> {
    // Remove the host header which crashes SSL
    const { host, ...headers } = request.headers; // eslint-disable-line @typescript-eslint/no-unused-vars

    delete headers['content-length']; // TODO: figure out why we need that

    // For now we do not support gzip
    delete headers['accept-encoding'];

    await new Promise(resolve => setTimeout(resolve, this.delay));

    const axiosResponse = await axios({
      data: request.body,
      url: `${this.targetUrl}${request.url}`,
      headers,
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
