import axios, { AxiosResponse } from 'axios';

import { NetworkService } from '../../domain/service';
import { Request, Response } from '../../domain/entity';
import { MementoConfiguration } from '../../configuration';

interface Dependencies {
  config: MementoConfiguration;
}

export class NetworkServiceAxios implements NetworkService {
  private config: MementoConfiguration;

  public constructor({ config }: Dependencies) {
    this.config = config;
  }

  public async executeRequest(request: Request): Promise<Response> {
    const dateBefore = new Date();
    let dateAfter: Date;
    let axiosResponse: AxiosResponse<any>;

    try {
      axiosResponse = await axios({
        data: request.body,
        url: `${this.config.targetUrl}${request.url}`,
        headers: request.headers,
        method: request.method,
        responseType: 'arraybuffer',
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
