import { createContainer, asClass, asValue } from 'awilix';

import { createApp } from './app';
import { RespondToRequest } from './domain/usecase';
import { NetworkServiceAxios } from './infrastructure/service';
import { configuration } from './configuration';

const container = createContainer();

container.register({
  // Constants
  targetUrl: asValue(configuration.targetUrl),
  delay: asValue(configuration.delay),

  // Use cases
  respondToRequestUseCase: asClass(RespondToRequest),

  // Repositories
  responseRepository: asClass(configuration.dbAdapter).singleton(),

  // Services
  networkService: asClass(NetworkServiceAxios).singleton(),
});

createApp({ port: configuration.port, container }).run();
