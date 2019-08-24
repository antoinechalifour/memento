/* istanbul ignore file */

import { AwilixContainer } from 'awilix';

import { RequestRepository } from '../domain/repository';
import { moveTxtToProperFileTypeMigration } from './cache-fs/1-txt-to-proper-file-type';

export async function runMigrations(container: AwilixContainer) {
  const targetUrl = container.resolve<string>('targetUrl');
  const cacheDirectory = container.resolve<string>('cacheDirectory');
  const requestRepository = container.resolve<RequestRepository>(
    'requestRepository'
  );

  await moveTxtToProperFileTypeMigration({
    targetUrl,
    cacheDirectory,
    requestRepository,
  });
}
