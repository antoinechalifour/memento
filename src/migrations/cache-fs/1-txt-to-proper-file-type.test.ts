import fs from 'fs-extra';
import path from 'path';

import { getTestConfiguration } from '../../test-utils/config';
import { moveTxtToProperFileTypeMigration } from './1-txt-to-proper-file-type';

const MEMENTO_CACHE_DIR = path.join(
  __dirname,
  '../../../.memento-test-cache-migration-file-extensions'
);
const OUTPUT_DIRECTORY = `${MEMENTO_CACHE_DIR}/https___pokeapi-co_api_v2`;

function getOutputFilePath(fileName: string) {
  return path.join(OUTPUT_DIRECTORY, fileName);
}

afterAll(() => fs.remove(MEMENTO_CACHE_DIR));

beforeEach(() => fs.remove(MEMENTO_CACHE_DIR));

async function setupRequest(folder: string, body: any, metadata: any) {
  const requestDirectory = getOutputFilePath(folder);

  await fs.ensureDir(requestDirectory);
  await fs.writeFile(path.join(requestDirectory, 'body.txt'), body);
  await fs.writeJson(path.join(requestDirectory, 'metadata.json'), metadata);
}

describe('text/plain requests migration', () => {
  beforeEach(() =>
    setupRequest('get__text-74121b3875b9d4d16c7e9dfd80bd90ff50da5d86', 'Ok', {
      method: 'GET',
      url: '/text',
      requestBody: '',
      status: 200,
      requestHeaders: {},
      responseHeaders: { 'content-type': 'text/plain' },
      responseTime: 0,
    })
  );

  it('should not move the body file', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      config: getTestConfiguration({
        targetUrl: 'https://pokeapi.co/api/v2',
        cacheDirectory: MEMENTO_CACHE_DIR,
      }),
    });

    // Then
    const olfFileStillExists = await fs.pathExists(
      getOutputFilePath(
        'get__text-74121b3875b9d4d16c7e9dfd80bd90ff50da5d86/body.txt'
      )
    );

    // Assert that fold files have been moved to new files.
    expect(olfFileStillExists).toBe(true);
  });
});

describe('application/json requests migration', () => {
  beforeEach(() =>
    setupRequest(
      'get__json-728ad90473b5366f44ebc49a57da2c5df837d040',
      Buffer.from(JSON.stringify({ name: 'John Doe' })),
      {
        method: 'GET',
        url: '/json',
        requestBody: '',
        status: 200,
        requestHeaders: {},
        responseHeaders: { 'content-type': 'application/json' },
        responseTime: 0,
      }
    )
  );

  it('should move the body file to body.json', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      config: getTestConfiguration({
        targetUrl: 'https://pokeapi.co/api/v2',
        cacheDirectory: MEMENTO_CACHE_DIR,
      }),
    });

    // Then
    const oldFileExists = await fs.pathExists(
      getOutputFilePath(
        'get__json-728ad90473b5366f44ebc49a57da2c5df837d040/body.txt'
      )
    );
    const newFileExists = await fs.pathExists(
      getOutputFilePath(
        'get__json-728ad90473b5366f44ebc49a57da2c5df837d040/body.json'
      )
    );

    // Assert that fold files have been moved to new files.
    expect(oldFileExists).toBe(false);
    expect(newFileExists).toBe(true);
  });
});

describe('application/octet-stream request migration', () => {
  beforeEach(() =>
    setupRequest(
      'get__octet-stream-d1f560b23c4db2f2a2e0dfc1bfa32592d4370cb5',
      Buffer.from('something'),
      {
        method: 'GET',
        url: '/octet-stream',
        requestBody: '',
        status: 200,
        requestHeaders: {},
        responseHeaders: { 'content-type': 'application/octet-stream' },
        responseTime: 0,
      }
    )
  );

  it('should move the body file to body', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      config: getTestConfiguration({
        targetUrl: 'https://pokeapi.co/api/v2',
        cacheDirectory: MEMENTO_CACHE_DIR,
      }),
    });

    // Then
    const oldFileExists = await fs.pathExists(
      getOutputFilePath(
        'get__octet-stream-d1f560b23c4db2f2a2e0dfc1bfa32592d4370cb5/body.txt'
      )
    );
    const newFileExists = await fs.pathExists(
      getOutputFilePath(
        'get__octet-stream-d1f560b23c4db2f2a2e0dfc1bfa32592d4370cb5/body'
      )
    );

    // Assert that fold files have been moved to new files.
    expect(oldFileExists).toBe(false);
    expect(newFileExists).toBe(true);
  });
});

describe('requests respecting the new format', () => {
  beforeEach(async () => {
    const requestDirectory = getOutputFilePath(
      'get__new-format-bb4032a14daf7b56f8f9f4312ce139543bc9a281'
    );

    await fs.ensureDir(requestDirectory);
    await fs.writeFile(
      path.join(requestDirectory, 'body.xml'),
      '<text>something</text>'
    );
    await fs.writeJson(path.join(requestDirectory, 'metadata.json'), {
      method: 'GET',
      url: '/new-format',
      requestBody: '',
      status: 200,
      requestHeaders: {},
      responseHeaders: { 'content-type': 'application/xml' },
      responseTime: 0,
    });
  });

  it('should not move the body file', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      config: getTestConfiguration({
        targetUrl: 'https://pokeapi.co/api/v2',
        cacheDirectory: MEMENTO_CACHE_DIR,
      }),
    });

    // Then
    const oldFileExists = await fs.pathExists(
      getOutputFilePath(
        'get__new-format-bb4032a14daf7b56f8f9f4312ce139543bc9a281'
      )
    );

    expect(oldFileExists).toBe(true);
  });
});

describe('request that already have been migrated', () => {
  it('should do nothing', async () => {
    beforeEach(async () => {
      const requestDirectory = getOutputFilePath(
        'bb4032a14daf7b56f8f9f4312ce139543bc9a281'
      );

      await fs.ensureDir(requestDirectory);
      await fs.writeFile(
        path.join(requestDirectory, 'body.xml'),
        '<text>something</text>'
      );
      await fs.writeJson(path.join(requestDirectory, 'metadata.json'), {
        method: 'GET',
        url: '/new-format',
        requestBody: '',
        status: 200,
        requestHeaders: {},
        responseHeaders: { 'content-type': 'application/xml' },
        responseTime: 0,
      });
    });
  });

  it('should not move the body file', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      config: getTestConfiguration({
        targetUrl: 'https://pokeapi.co/api/v2',
        cacheDirectory: MEMENTO_CACHE_DIR,
      }),
    });

    // Then
    const oldFileExists = await fs.pathExists(
      getOutputFilePath('bb4032a14daf7b56f8f9f4312ce139543bc9a281')
    );

    expect(oldFileExists).toBe(true);
  });
});
