/* istanbul ignore file */

import { createContainer, asClass, asValue } from 'awilix';

import { createCli } from './cli';
import { createApp } from './app';
import { runMigrations } from './migrations';
import { getConfiguration } from './configuration';
import {
  RespondToRequest,
  ClearAllRequests,
  ClearRequest,
  RefreshRequest,
  ListRequest,
  GetRequestDetails,
  SetResponseTime,
} from './domain/usecase';
import { NetworkServiceAxios } from './infrastructure/service';
import { RequestRepositoryFile } from './infrastructure/repository';

export interface MementoOptions {
  cacheDirectory?: string;
}

export function Memento({ cacheDirectory }: MementoOptions = {}) {
  const container = createContainer();

  function loadConfiguration() {
    const configuration = getConfiguration();

    container.register({
      // Constants
      config: asValue(configuration),

      // Use cases
      respondToRequestUseCase: asClass(RespondToRequest),
      clearAllRequestsUseCase: asClass(ClearAllRequests),
      clearRequestUseCase: asClass(ClearRequest),
      refreshRequestUseCase: asClass(RefreshRequest),
      listRequestsUseCase: asClass(ListRequest),
      getRequestDetailsUseCase: asClass(GetRequestDetails),
      setResponseTimeUseCase: asClass(SetResponseTime),

      // Repositories
      requestRepository: asClass(RequestRepositoryFile),

      // Services
      networkService: asClass(NetworkServiceAxios),
    });

    if (cacheDirectory) {
      container.register('cacheDirectory', asValue(cacheDirectory));
    }
  }

  loadConfiguration();
  const app = createApp({ container });

  return {
    run: app.run,
    stop: app.stop,
    container,
    reload() {
      app.stop();
      loadConfiguration();
      return app.run();
    },
  };
}

export { createCli, runMigrations };
