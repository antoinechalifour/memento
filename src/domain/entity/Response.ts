import { Headers } from './Headers';

export class Response {
  public constructor(
    public readonly status: number,
    public readonly headers: Headers,
    public readonly body: string
  ) {
    this.headers = this.buildHeaders(headers);
  }

  private buildHeaders(inputHeaders: Headers): Headers {
    const EXCLUDED_HEADERS = [
      'connection',
      'keep-alive',
      'access-control-allow-origin',
      'access-control-allow-credentials',
      'access-control-allow-headers',
      'access-control-allow-methods',
      'access-control-expose-headers',
      'access-control-max-age',
      'access-control-request-headers',
      'access-control-request-method',
      'origin',
      'content-encoding',
      'forwarded',
      'via',
      'transfer-encoding',
      'te',
      'trailer',
      'upgrade',
    ];
    const headers: Headers = {};

    Object.keys(inputHeaders).forEach(key => {
      if (EXCLUDED_HEADERS.includes(key.toLocaleLowerCase())) {
        return;
      }
      headers[key.toLowerCase()] = inputHeaders[key];
    });

    return headers;
  }
}
