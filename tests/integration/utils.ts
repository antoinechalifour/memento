import { createContainer, asValue, asClass } from 'awilix';
import supertest from 'supertest';

import { createApp } from '../../src/app';
import { RespondToRequest } from '../../src/domain/usecase';
import { RequestRepositoryMemory } from '../../src/infrastructure/repository';
import { NetworkServiceAxios } from '../../src/infrastructure/service';
import { NetworkService } from '../../src/domain/service';

export function getTestApplication() {
  // Setup the application configuration
  const targetUrl = 'http://localhost:8000';
  const container = createContainer();

  container.register({
    // Constants
    targetUrl: asValue(targetUrl),
    delay: asValue(0),

    // Use cases
    respondToRequestUseCase: asClass(RespondToRequest),

    // Repositories
    requestRepository: asClass(RequestRepositoryMemory).singleton(),

    // Services
    networkService: asClass(NetworkServiceAxios).singleton(),
  });

  // Configure supertest
  const { app } = createApp({ port: 0, container });
  const server = app.listen();

  const request = supertest(server);

  // Configure spies
  const networkService = container.resolve<NetworkService>('networkService');
  const networkServiceSpy = jest.spyOn(networkService, 'executeRequest');

  return {
    targetUrl,
    request,
    server,
    spies: {
      networkService: networkServiceSpy,
    },
  };
}
