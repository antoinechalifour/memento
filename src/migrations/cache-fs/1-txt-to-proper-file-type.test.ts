import fs from 'fs-extra';
import path from 'path';

import { RequestRepositoryFile } from '../../infrastructure/repository';
import { Request, Response } from '../../domain/entity';
import { moveTxtToProperFileTypeMigration } from './1-txt-to-proper-file-type';

const MEMENTO_CACHE_DIR = path.join(__dirname, '../../../.memento-test-cache');
const OUTPUT_DIRECTORY = `${MEMENTO_CACHE_DIR}/https___pokeapi-co_api_v2`;
let requestRepository: RequestRepositoryFile;

function getOutputFilePath(fileName: string) {
  return path.join(OUTPUT_DIRECTORY, fileName);
}

afterAll(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

beforeEach(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);

  requestRepository = new RequestRepositoryFile({
    targetUrl: 'https://pokeapi.co/api/v2',
    cacheDirectory: MEMENTO_CACHE_DIR,
  });
});

describe('text/plain requests migration', () => {
  beforeEach(async () => {
    const request = new Request('GET', '/text', {}, '');
    const response = new Response(
      200,
      {
        'content-type': 'text/plain',
      },
      Buffer.from('Ok'),
      0
    );

    await requestRepository.persistResponseForRequest(request, response);
  });

  it('should not move the body file', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      targetUrl: 'https://pokeapi.co/api/v2',
      cacheDirectory: MEMENTO_CACHE_DIR,
      requestRepository,
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
  beforeEach(async () => {
    const request = new Request('GET', '/json', {}, '');
    const response = new Response(
      200,
      {
        'content-type': 'application/json',
      },
      Buffer.from('{"name": "John Doe"}'),
      0
    );

    await requestRepository.persistResponseForRequest(request, response);

    await fs.move(
      getOutputFilePath(
        'get__json-728ad90473b5366f44ebc49a57da2c5df837d040/body.json'
      ),
      getOutputFilePath(
        'get__json-728ad90473b5366f44ebc49a57da2c5df837d040/body.txt'
      )
    );
  });

  it('should move the body file to body.json', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      targetUrl: 'https://pokeapi.co/api/v2',
      cacheDirectory: MEMENTO_CACHE_DIR,
      requestRepository,
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
  beforeEach(async () => {
    const request = new Request('GET', '/octet-stream', {}, '');
    const response = new Response(
      200,
      {
        'content-type': 'application/octet-stream',
      },
      Buffer.from('something'),
      0
    );

    await requestRepository.persistResponseForRequest(request, response);

    await fs.move(
      getOutputFilePath(
        'get__octet-stream-d1f560b23c4db2f2a2e0dfc1bfa32592d4370cb5/body'
      ),
      getOutputFilePath(
        'get__octet-stream-d1f560b23c4db2f2a2e0dfc1bfa32592d4370cb5/body.txt'
      )
    );
  });

  it('should move the body file to body', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      targetUrl: 'https://pokeapi.co/api/v2',
      cacheDirectory: MEMENTO_CACHE_DIR,
      requestRepository,
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
    const request = new Request('GET', '/new-format', {}, '');
    const response = new Response(
      200,
      {
        'content-type': 'application.xml',
      },
      Buffer.from('<text>something</text>'),
      0
    );

    await requestRepository.persistResponseForRequest(request, response);
  });

  it('should not move the body file', async () => {
    // When
    await moveTxtToProperFileTypeMigration({
      targetUrl: 'https://pokeapi.co/api/v2',
      cacheDirectory: MEMENTO_CACHE_DIR,
      requestRepository,
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
