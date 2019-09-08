/* istanbul ignore file */

import { AwilixContainer } from 'awilix';

import { MementoConfiguration } from '../configuration';
import { moveTxtToProperFileTypeMigration } from './cache-fs/1-txt-to-proper-file-type';
import { moveRequestsToIdDirectories } from './cache-fs/2-remove-url-from-request-directory';

export async function runMigrations(container: AwilixContainer) {
  const config = container.resolve<MementoConfiguration>('config');

  await moveTxtToProperFileTypeMigration({ config });

  await moveRequestsToIdDirectories({ config });
}
