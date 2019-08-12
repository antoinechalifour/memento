import { Headers } from './Headers';

export class Response {
  public constructor(
    public readonly status: number,
    public readonly headers: Headers,
    public readonly body: string
  ) {}
}
