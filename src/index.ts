import yargs from 'yargs';
import assert from 'assert';
import { createContainer, asClass, asValue } from 'awilix';
import cosmiconfig from 'cosmiconfig';

import { createApp } from './app';
import { RespondToRequest } from './domain/usecase';
import { ResponseRepositoryMemory } from './infrastructure/repository';
import { NetworkServiceAxios } from './infrastructure/service';

interface Configuration {
  targetUrl: string;
  delay: number;
  port: number;
}

function getDelayFromString(str: string) {
  return str ? parseInt(str, 10) : 0;
}

function getPortFromString(port: string) {
  return port ? parseInt(port, 10) : 3344;
}

function loadConfigurationFromFile(): Configuration | null {
  const configExplorer = cosmiconfig('memento');
  const cosmicConfiguration = configExplorer.searchSync();

  if (!cosmicConfiguration) {
    return null;
  }

  return {
    targetUrl: cosmicConfiguration.config.targetUrl,
    delay: getDelayFromString(cosmicConfiguration.config.delay),
    port: getPortFromString(cosmicConfiguration.config.port),
  };
}

function loadConfigurationFromCli(): Configuration {
  const cliArgs = yargs.argv;
  const targetUrl = cliArgs.targetUrl as string;
  const delay = getDelayFromString(cliArgs.delay as string);
  const port = getPortFromString(cliArgs.port as string);

  return { targetUrl, delay, port };
}

const configuration = loadConfigurationFromFile() || loadConfigurationFromCli();

assert(configuration.targetUrl, 'targetUrl option is required');

const container = createContainer();

container.register({
  // Constants
  targetUrl: asValue(configuration.targetUrl),
  delay: asValue(configuration.delay),

  // Use cases
  respondToRequestUseCase: asClass(RespondToRequest),

  // Repositories
  responseRepository: asClass(ResponseRepositoryMemory).singleton(),

  // Services
  networkService: asClass(NetworkServiceAxios).singleton(),
});

createApp({ port: configuration.port, container }).run();
