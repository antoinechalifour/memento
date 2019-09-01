import fs from 'fs-extra';
import path from 'path';
import { createContainer, asValue } from 'awilix';

import { runMigrations } from './index';

const MEMENTO_CACHE_DIR = path.join(
  __dirname,
  '../../.memento-test-migration-integration'
);
const OUTPUT_DIRECTORY = `${MEMENTO_CACHE_DIR}/https___pokeapi-co_api_v2`;

afterAll(() => fs.remove(MEMENTO_CACHE_DIR));

beforeAll(async () => {
  await fs.remove(MEMENTO_CACHE_DIR);

  // Write old body.txt (no extension base on content type)
  const migration1Directory = path.join(
    OUTPUT_DIRECTORY,
    'get__pokemon_pikachu-4944413164d3e35b3798aa21c2d53883988e7c5d'
  );
  await fs.ensureDir(migration1Directory);
  await fs.writeFile(
    path.join(migration1Directory, 'body.txt'),
    JSON.stringify({
      id: 25,
      name: 'pikachu',
      order: 35,
    })
  );
  await fs.writeJSON(path.join(migration1Directory, 'metadata.json'), {
    method: 'GET',
    url: '/pokemon/pikachu',
    requestBody: '',
    status: 200,
    requestHeaders: { 'user-agent': 'curl/7.54.0', accept: '*/*' },
    responseHeaders: {
      date: 'Sun, 01 Sep 2019 12:27:43 GMT',
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': [
        '__cfduid=df5aa19611dc81d957ce3b10995757ac01567340863; expires=Mon, 31-Aug-20 12:27:43 GMT; path=/; domain=.pokeapi.co; HttpOnly; Secure',
      ],
      'cache-control': 'public, max-age=86400, s-maxage=86400',
      etag: 'W/"2b620-0BXxLv4/KrO1ELF/qjElgUSxQtM"',
      'function-execution-id': '3zd9uq2bdwl3',
      'x-powered-by': 'Express',
      'x-cloud-trace-context': '8687e29d58c7ba2bd9cef291e32074aa',
      'x-served-by': 'cache-hhn4051-HHN',
      'x-cache': 'HIT',
      'x-cache-hits': '1',
      'x-timer': 'S1563653703.741406,VS0,VE1',
      vary: 'accept-encoding, x-fh-requested-host, cookie, authorization',
      'cf-cache-status': 'HIT',
      age: '55',
      'expect-ct':
        'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
      server: 'cloudflare',
      'cf-ray': '50f73d6bba85cdb7-CDG',
    },
    responseTime: 88,
  });
});

it('should migrate the cache directory to the new format', async () => {
  // Given
  const container = createContainer();
  container.register({
    targetUrl: asValue('https://pokeapi.co/api/v2'),
    cacheDirectory: asValue(MEMENTO_CACHE_DIR),
  });

  // When
  await runMigrations(container);

  // Then
  const requestOutputDirectory = path.join(
    OUTPUT_DIRECTORY,
    '4944413164d3e35b3798aa21c2d53883988e7c5d'
  );
  const requestDirectoryExists = await fs.pathExists(requestOutputDirectory);
  const metadataExists = await fs.pathExists(
    path.join(requestOutputDirectory, 'metadata.json')
  );
  const bodyExists = await fs.pathExists(
    path.join(requestOutputDirectory, 'body.json')
  );

  expect(requestDirectoryExists).toBe(true);
  expect(metadataExists).toBe(true);
  expect(bodyExists).toBe(true);
});
