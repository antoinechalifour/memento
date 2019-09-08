import { createContainer, asValue } from 'awilix';

import { getTestKoaContext } from '../../../test-utils/application';
import { Response, Method, Headers } from '../../../domain/entity';
import { respondToRequest } from './handler';

interface GetContextOptions {
  execute: jest.Mock;
  method?: Method;
  url?: string;
  headers?: Headers;
  body?: string;
}

function getContext({
  body,
  execute,
  headers,
  method,
  url,
}: GetContextOptions) {
  const ctx = getTestKoaContext();
  const container = createContainer();
  container.register({
    respondToRequestUseCase: asValue({ execute }),
  });
  ctx.state.container = container;
  ctx.request.method = method;
  ctx.request.url = url;
  ctx.request.headers = headers;
  ctx.request.rawBody = body;

  return ctx;
}

describe('responseToRequest', () => {
  it('should call the use case with the correct parameters', async () => {
    // Given
    const response = new Response(201, {}, Buffer.from(''), 0);
    const execute = jest.fn().mockResolvedValue(response);
    const ctx = getContext({
      body: 'Some text body',
      execute,
      headers: { authorization: 'Bearer token' },
      method: 'POST',
      url: '/test',
    });

    // When
    await respondToRequest(ctx);

    // Then
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      'POST',
      '/test',
      { authorization: 'Bearer token' },
      'Some text body'
    );
  });

  it('should call the use case with defaults when params are not provided', async () => {
    // Given
    const response = new Response(201, {}, Buffer.from(''), 0);
    const execute = jest.fn().mockResolvedValue(response);
    const ctx = getContext({
      execute,
    });

    // When
    await respondToRequest(ctx);

    // Then
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith('GET', '/', {}, '');
  });

  it('should response with the response', async () => {
    // Given
    const response = new Response(201, {}, Buffer.from('Some response'), 0);
    const execute = jest.fn().mockResolvedValue(response);
    const ctx = getContext({
      execute,
    });

    // When
    await respondToRequest(ctx);

    // Then
    expect(ctx.status).toEqual(201);
    expect(ctx.set).toHaveBeenCalledTimes(1);
    expect(ctx.set).toHaveBeenCalledWith(response.headers);
    expect(ctx.body).toEqual(response.body);
  });

  it('should set the cookies', async () => {
    // Given
    const response = new Response(
      201,
      {
        // @ts-ignore
        'set-cookie': ['_ga=value1; Path=/; Secure', '_gid=value2; Path=/'],
      },
      Buffer.from('Some response'),
      0
    );
    const execute = jest.fn().mockResolvedValue(response);
    const ctx = getContext({
      execute,
    });

    // When
    await respondToRequest(ctx);

    // Then
    expect(ctx.set).toHaveBeenCalledTimes(2);
    expect(ctx.set).toHaveBeenCalledWith('set-cookie', response.cookies);
  });
});
