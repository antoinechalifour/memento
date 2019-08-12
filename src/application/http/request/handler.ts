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
        ctx.set(response.headers);
        ctx.body = response.body;
    }
}

const handler = makeInvoker(RequestHandler);

export const respondToRequest = handler('respondToRequest');
