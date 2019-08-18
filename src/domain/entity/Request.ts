import hashObject from 'object-hash';

import { Method } from './Method';
import { Headers } from './Headers';

export class Request {
  public constructor(
    public readonly method: Method,
    public readonly url: string,
    public readonly headers: Headers,
    public readonly body: string
  ) {
    this.headers = this.buildHeaders(headers);
  }

  public get id() {
    return hashObject({
      method: this.method,
      url: this.url,
      body: this.body,
      ...this.headers,
    });
  }

  private buildHeaders(inputHeaders: Headers): Headers {
    const HOP_BY_HOP_HEADERS = [
      'proxy-authenticate',
      'upgrade',
      'host',
      'accept-encoding',
      'content-length',
      'cache-control',
      'if-match',
      'if-modified-match',
      'if-none-match',
      'if-unmodified-match',
    ];
    const headers: Headers = {};

    Object.keys(inputHeaders).forEach(key => {
      if (HOP_BY_HOP_HEADERS.includes(key.toLowerCase())) {
        return;
      }
      headers[key.toLowerCase()] = inputHeaders[key];
    });

    return headers;
  }
}
