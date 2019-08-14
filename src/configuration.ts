import assert from 'assert';
import cosmiconfig from 'cosmiconfig';
import yargs from 'yargs';

import { ResponseRepositoryConstructor } from './domain/repository';
import {
  ResponseRepositoryFile,
  ResponseRepositoryMemory,
} from './infrastructure/repository';

interface Configuration {
  targetUrl: string;
  delay: number;
  port: number;
  dbAdapter: ResponseRepositoryConstructor;
}

function getDelayFromString(str: string) {
  return str ? parseInt(str, 10) : 0;
}

function getPortFromString(port: string) {
  return port ? parseInt(port, 10) : 3344;
}

function getDbAdapter(adapter: string) {
  switch (adapter) {
    case 'file':
      return ResponseRepositoryFile;
    default:
      return ResponseRepositoryMemory;
  }
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
    dbAdapter: getDbAdapter(cosmicConfiguration.config.dbAdapter),
  };
}

function loadConfigurationFromCli(): Configuration {
  const cliArgs = yargs.argv;
  const targetUrl = cliArgs.targetUrl as string;
  const delay = getDelayFromString(cliArgs.delay as string);
  const port = getPortFromString(cliArgs.port as string);
  const dbAdapter = getDbAdapter(cliArgs.dbAdapter as string);

  return { targetUrl, delay, port, dbAdapter };
}

export const configuration =
  loadConfigurationFromFile() || loadConfigurationFromCli();

assert(configuration.targetUrl, 'targetUrl option is required');
