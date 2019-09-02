import { Context } from 'koa';
import { makeInvoker } from 'awilix-koa';

import { Method } from '../../../domain/entity';
import { RespondToRequest, Headers } from '../../../domain/usecase';

interface Dependencies {
  respondToRequestUseCase: RespondToRequest;
}

class RequestHandler {
  private respondToRequestUseCase: RespondToRequest;

  public constructor({ respondToRequestUseCase }: Dependencies) {
    this.respondToRequestUseCase = respondToRequestUseCase;
  }

  public async respondToRequest(ctx: Context) {
    const { request } = ctx;

    const response = await this.respondToRequestUseCase.execute(
      (request.method || 'GET') as Method,
      request.url || '/',
      (request.headers || {}) as Headers,
      ctx.request.rawBody || ''
    );

    ctx.status = response.status;

    // For some reason response.headers['set-cookie'] is an array
    // and koa typings do not accept array header values, but it still works.
    // calling ctx.set('set-cookie') multiple times does not work though.
    ctx.set(response.headers as any);

    ctx.body = response.body;
  }
}

const handler = makeInvoker(RequestHandler);

export const respondToRequest = handler('respondToRequest');
