import yargs from 'yargs';
import assert from 'assert';
import { createContainer, asClass, asValue } from 'awilix';

import { createApp } from './app';
import { RespondToRequest } from './domain/usecase';
import { ResponseRepositoryMemory } from './infrastructure/repository';
import { NetworkServiceAxios } from './infrastructure/service';

const cliArgs = yargs.argv;

assert(cliArgs.targetUrl, 'targetUrl option is required');

const targetUrl = cliArgs.targetUrl as string;
const delay = cliArgs.delay ? parseInt(cliArgs.delay as string, 10) : 0;
const port = cliArgs.port ? parseInt(cliArgs.port as string, 10) : 3344;

const container = createContainer();

container.register({
  // Constants
  targetUrl: asValue(targetUrl),
  delay: asValue(delay),

  // Use cases
  respondToRequestUseCase: asClass(RespondToRequest),

  // Repositories
  responseRepository: asClass(ResponseRepositoryMemory),

  // Services
  networkService: asClass(NetworkServiceAxios),
});

createApp({ port, container }).run();
