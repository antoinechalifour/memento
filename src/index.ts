/* istanbul ignore file */

import { createContainer, asClass, asValue } from 'awilix';

import { createCli } from './cli';
import { createApp } from './app';
import { runMigrations } from './migrations';
import { configuration } from './configuration';
import {
  RespondToRequest,
  ClearAllRequests,
  ClearRequest,
  RefreshRequest,
  ListRequest,
  GetRequestDetails,
} from './domain/usecase';
import { NetworkServiceAxios } from './infrastructure/service';
import { RequestRepositoryFile } from './infrastructure/repository';
import { version } from '../package.json';

const container = createContainer();

container.register({
  // Constants
  targetUrl: asValue(configuration.targetUrl),
  cacheDirectory: asValue(configuration.cacheDirectory),
  appVersion: asValue(version),
  useRealResponseTime: asValue(configuration.useRealResponseTime),

  // Use cases
  respondToRequestUseCase: asClass(RespondToRequest),
  clearAllRequestsUseCase: asClass(ClearAllRequests),
  clearRequestUseCase: asClass(ClearRequest),
  refreshRequestUseCase: asClass(RefreshRequest),
  listRequestsUseCase: asClass(ListRequest),
  getRequestDetailsUseCase: asClass(GetRequestDetails),

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

export { createCli, runMigrations };
