/* istanbul ignore file */

import { Server } from 'http';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';
import { AwilixContainer } from 'awilix';
import { scopePerRequest } from 'awilix-koa';

import { respondToRequest } from './application/http/request';

interface AppOptions {
  container: AwilixContainer;
}

export function createApp({ container }: AppOptions) {
  const app = new Koa();
  let server: Server;

  app
    .use(cors())
    .use(bodyparser())
    .use(scopePerRequest(container))
    .use(respondToRequest);

  return {
    app,
    run() {
      const port = container.resolve<number>('port');

      return new Promise(resolve => {
        server = app.listen(port, resolve);
      });
    },
    stop() {
      server.close();
    },
  };
}
