import fs from 'fs-extra';
import path from 'path';

import { moveRequestsToIdDirectories } from './2-remove-url-from-request-directory';

const MEMENTO_CACHE_DIR = path.join(
  __dirname,
  '../../../.memento-test-cache-migration-2'
);
const OUTPUT_DIRECTORY = path.join(
  MEMENTO_CACHE_DIR,
  'https___pokeapi-co_api_v2'
);

afterAll(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

beforeEach(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

it('should move all old directories to a folder which name is the request id', async () => {
  // Given
  const requestDirectory = path.join(
    OUTPUT_DIRECTORY,
    'get__pokemon_meowth-df16b04d4edb9d2f8bef472cba763eabcfce7511'
  );

  await fs.ensureDir(requestDirectory);
  await fs.writeJSON(
    path.join(requestDirectory, 'body.json'),
    require('./fixtures/body.json')
  );
  await fs.writeJSON(
    path.join(requestDirectory, 'metadata.json'),
    require('./fixtures/metadata.json')
  );

  // When
  await moveRequestsToIdDirectories({
    targetUrl: 'https://pokeapi.co/api/v2',
    cacheDirectory: MEMENTO_CACHE_DIR,
  });

  // Then
  const expectedDirectory = path.join(
    OUTPUT_DIRECTORY,
    'df16b04d4edb9d2f8bef472cba763eabcfce7511'
  );
  const oldDirectoryExists = await fs.pathExists(requestDirectory);
  const newDirectoryExists = await fs.pathExists(expectedDirectory);

  expect(oldDirectoryExists).toBe(false);
  expect(newDirectoryExists).toBe(true);
});
