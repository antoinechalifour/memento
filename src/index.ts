/* istanbul ignore file */

import { createContainer, asClass, asValue } from 'awilix';

import { createCli } from './cli';
import { createApp } from './app';
import {
  RespondToRequest,
  ClearAllRequests,
  ClearRequest,
  RefreshRequest,
  ListRequest,
} from './domain/usecase';
import { NetworkServiceAxios } from './infrastructure/service';
import { configuration } from './configuration';

const container = createContainer();

container.register({
  // Constants
  targetUrl: asValue(configuration.targetUrl),
  delay: asValue(configuration.delay),

  // Use cases
  respondToRequestUseCase: asClass(RespondToRequest),
  clearAllRequestsUseCase: asClass(ClearAllRequests),
  clearRequestUseCase: asClass(ClearRequest),
  refreshRequestUseCase: asClass(RefreshRequest),
  listRequestsUseCase: asClass(ListRequest),

  // Repositories
  responseRepository: asClass(configuration.dbAdapter).singleton(),

  // Services
  networkService: asClass(NetworkServiceAxios).singleton(),
});

const app = createApp({ port: configuration.port, container });

app.run().then(() => {
  createCli({ container }).show();
});

function stopServer() {
  app.stop();
}

process.on('SIGINT', stopServer);
process.on('exit', stopServer);
