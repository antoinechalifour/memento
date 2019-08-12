import hashObject from 'object-hash';

import { Method } from './Method';
import { Headers } from './Headers';

export class Request {
  public constructor(
    public readonly method: Method,
    public readonly url: string,
    public readonly headers: Headers,
    public readonly body: string
  ) {}

  public getComputedId() {
    return hashObject({
      method: this.method,
      url: this.url,
      body: this.body,
      ...this.headers,
    });
  }
}
