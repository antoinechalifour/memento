/* istanbul ignore file */

import { AwilixContainer } from 'awilix';

import { moveTxtToProperFileTypeMigration } from './cache-fs/1-txt-to-proper-file-type';
import { moveRequestsToIdDirectories } from './cache-fs/2-remove-url-from-request-directory';

export async function runMigrations(container: AwilixContainer) {
  const targetUrl = container.resolve<string>('targetUrl');
  const cacheDirectory = container.resolve<string>('cacheDirectory');

  await moveTxtToProperFileTypeMigration({
    targetUrl,
    cacheDirectory,
  });

  await moveRequestsToIdDirectories({
    targetUrl,
    cacheDirectory,
  });
}
