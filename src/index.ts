/* istanbul ignore file */

import { createContainer, asClass, asValue } from 'awilix';

import { createCli } from './cli';
import { createApp } from './app';
import { configuration } from './configuration';
import {
  RespondToRequest,
  ClearAllRequests,
  ClearRequest,
  RefreshRequest,
  ListRequest,
} from './domain/usecase';
import { NetworkServiceAxios } from './infrastructure/service';
import { RequestRepositoryFile } from './infrastructure/repository';

const container = createContainer();

container.register({
  // Constants
  targetUrl: asValue(configuration.targetUrl),
  delay: asValue(configuration.delay),
  cacheDirectory: asValue(configuration.cacheDirectory),

  // Use cases
  respondToRequestUseCase: asClass(RespondToRequest),
  clearAllRequestsUseCase: asClass(ClearAllRequests),
  clearRequestUseCase: asClass(ClearRequest),
  refreshRequestUseCase: asClass(RefreshRequest),
  listRequestsUseCase: asClass(ListRequest),

  // Repositories
  requestRepository: asClass(RequestRepositoryFile).singleton(),

  // Services
  networkService: asClass(NetworkServiceAxios).singleton(),
});

export interface MementoOptions {
  cacheDirectory?: string;
}

export function Memento({ cacheDirectory }: MementoOptions = {}) {
  if (cacheDirectory) {
    container.register('cacheDirectory', asValue(cacheDirectory));
  }

  const app = createApp({ port: configuration.port, container });

  return {
    run: app.run,
    stop: app.stop,
    container,
  };
}

export { createCli };
