/* istanbul ignore file */

import path from 'path';
import assert from 'assert';
import cosmiconfig from 'cosmiconfig';

import { version } from '../package.json';
import { DisableCachePattern } from './domain/entity';

function getPortFromString(port: string | undefined): number {
  return port ? parseInt(port, 10) : 3344;
}

function getCacheDirectory(directory: string | undefined): string {
  const defaultCacheDirectory = path.join(process.cwd(), '.memento-cache');

  return directory ? path.resolve(directory) : defaultCacheDirectory;
}

function getUseRealResponseTime(useRealResponseTime: string | undefined) {
  return useRealResponseTime ? Boolean(useRealResponseTime) : false;
}

export function getConfiguration() {
  const configExplorer = cosmiconfig('memento');
  const cosmicConfiguration = configExplorer.searchSync();

  if (!cosmicConfiguration) {
    throw new Error(
      'Memento configuration was not found. Did you create a .mementorc file?'
    );
  }

  const configuration = {
    targetUrl: cosmicConfiguration.config.targetUrl as string,
    port: getPortFromString(cosmicConfiguration.config.port),
    version,
    cacheDirectory: getCacheDirectory(
      cosmicConfiguration.config.cacheDirectory
    ),
    useRealResponseTime: getUseRealResponseTime(
      cosmicConfiguration.config.useRealResponseTime
    ),
    disableCachingPatterns: (cosmicConfiguration.config
      .disableCachingPatterns || []) as DisableCachePattern[],
    ignoreCookiesPattern: new RegExp(
      cosmicConfiguration.config.ignoreCookiesPattern || 'a^', // a^ matches nothing by default
      'g'
    ),
  };

  assert(configuration.targetUrl, 'targetUrl option is required');

  configuration.disableCachingPatterns.forEach((option: any) => {
    assert(option.method, 'Invalid disableCachingPatterns: method is required');
    assert(
      option.urlPattern,
      'Invalid disableCachingPatterns: urlPattern is required'
    );
  });

  return configuration;
}

export type MementoConfiguration = ReturnType<typeof getConfiguration>;
