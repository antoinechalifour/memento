/* istanbul ignore file */

import path from 'path';
import assert from 'assert';
import cosmiconfig from 'cosmiconfig';

function getDelayFromString(str: string | undefined): number {
  return str ? parseInt(str, 10) : 0;
}

function getPortFromString(port: string | undefined): number {
  return port ? parseInt(port, 10) : 3344;
}

function getCacheDirectory(directory: string | undefined): string {
  const defaultCacheDirectory = path.join(process.cwd(), '.memento-cache');

  return directory ? path.resolve(directory) : defaultCacheDirectory;
}

const configExplorer = cosmiconfig('memento');
const cosmicConfiguration = configExplorer.searchSync();

if (!cosmicConfiguration) {
  throw new Error(
    'Memento configuration was not found. Did you create a .mementorc file?'
  );
}

export const configuration = {
  targetUrl: cosmicConfiguration.config['target-url'],
  delay: getDelayFromString(cosmicConfiguration.config.delay),
  port: getPortFromString(cosmicConfiguration.config.port),
  cacheDirectory: getCacheDirectory(
    cosmicConfiguration.config['cache-directory']
  ),
};

assert(configuration.targetUrl, 'target-url option is required');
