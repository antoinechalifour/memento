import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import loggerMiddleware from 'koa-logger';
import cors from '@koa/cors';
import { AwilixContainer } from 'awilix';
import { scopePerRequest } from 'awilix-koa';

import { respondToRequest } from './application/http/request';
import { logger } from './util/logger';

interface AppOptions {
  port: number;
  container: AwilixContainer;
}

export function createApp({ port, container }: AppOptions) {
  const app = new Koa();
  const targetUrl = container.resolve('targetUrl');
  const delay = container.resolve('delay');

  app
    .use(cors())
    .use(loggerMiddleware())
    .use(bodyparser())
    .use(scopePerRequest(container))
    .use(respondToRequest);

  return {
    app,
    run() {
      return new Promise(resolve =>
        app.listen(port, () => {
          logger.info(`Memento running @ http://localhost:${port}`);
          logger.info(
            `Memento configured to proxy to ${targetUrl} with a delay of ${delay}ms`
          );

          resolve();
        })
      );
    },
  };
}
