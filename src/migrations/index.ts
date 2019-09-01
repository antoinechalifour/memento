/* istanbul ignore file */

import { AwilixContainer } from 'awilix';

import { moveTxtToProperFileTypeMigration } from './cache-fs/1-txt-to-proper-file-type';

export async function runMigrations(container: AwilixContainer) {
  const targetUrl = container.resolve<string>('targetUrl');
  const cacheDirectory = container.resolve<string>('cacheDirectory');

  await moveTxtToProperFileTypeMigration({
    targetUrl,
    cacheDirectory,
  });
}
