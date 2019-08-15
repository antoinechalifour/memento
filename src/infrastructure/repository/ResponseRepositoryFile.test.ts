import path from 'path';
import fs from 'fs-extra';

import { Request, Response } from '../../domain/entity';
import { ResponseRepositoryFile } from './ResponseRepositoryFile';

const MEMENTO_CACHE_DIR = path.join(__dirname, '../../../.memento-cache');
const OUTPUT_DIRECTORY = `${MEMENTO_CACHE_DIR}/https___pokeapi-co_api_v2`;

beforeEach(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

afterAll(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

describe('JSON support', () => {
  const CASES = [
    'APPLICATION/JSON',
    'application/json',
    'application/json; chartset=UTF-8;',
  ];

  CASES.forEach(contentType => {
    it(`should persist the ${contentType} response and its meta data`, async () => {
      // Given
      const inputRequest = new Request(
        'GET',
        '/pokemon/pikachu',
        {
          authorization: 'Bearer token',
        },
        ''
      );
      const inputResponse = new Response(
        200,
        {
          'content-type': contentType,
        },
        JSON.stringify({ id: 'user-1', name: 'John Doe' })
      );
      const responseRepository = new ResponseRepositoryFile({
        targetUrl: 'https://pokeapi.co/api/v2',
      });

      // When
      await responseRepository.persistResponseForRequest(
        inputRequest,
        inputResponse
      );

      const metadataContent = await fs.readJSON(
        `${OUTPUT_DIRECTORY}/get__pokemon_pikachu-${inputRequest.getComputedId()}/metadata.json`
      );
      const bodyContent = await fs.readJSON(
        `${OUTPUT_DIRECTORY}/get__pokemon_pikachu-${inputRequest.getComputedId()}/body.json`
      );

      //Then
      expect(metadataContent).toEqual({
        status: 200,
        requestHeaders: {
          authorization: 'Bearer token',
        },
        responseHeaders: {
          'content-type': contentType,
        },
      });
      expect(bodyContent).toEqual({
        id: 'user-1',
        name: 'John Doe',
      });
    });
  });
});

describe('XML support', () => {
  const CASES = ['APPLICATION/XML', 'application/xml', 'TEXT/XML', 'text/xml'];

  CASES.forEach(contentType => {
    it(`should persist the ${contentType} response and its meta data`, async () => {
      // Given
      const inputRequest = new Request('GET', '/notes', {}, '');
      const inputResponse = new Response(
        200,
        {
          'content-type': contentType,
        },
        '<Note><Author>Jane</Author><Content>Hello world</Content></Note>'
      );
      const responseRepository = new ResponseRepositoryFile({
        targetUrl: 'https://pokeapi.co/api/v2',
      });

      // When
      await responseRepository.persistResponseForRequest(
        inputRequest,
        inputResponse
      );

      const metadataContent = await fs.readJSON(
        `${OUTPUT_DIRECTORY}/get__notes-${inputRequest.getComputedId()}/metadata.json`
      );
      const bodyContent = await fs.readFile(
        `${OUTPUT_DIRECTORY}/get__notes-${inputRequest.getComputedId()}/body.xml`,
        'utf-8'
      );

      //Then
      expect(metadataContent).toEqual({
        status: 200,
        requestHeaders: {},
        responseHeaders: {
          'content-type': contentType,
        },
      });
      expect(bodyContent).toEqual(
        '<Note><Author>Jane</Author><Content>Hello world</Content></Note>'
      );
    });
  });
});

it('should persist other types as txt with their meta data', async () => {
  // Given
  const inputRequest = new Request('GET', '/text', {}, '');
  const inputResponse = new Response(
    200,
    {
      'content-type': 'text/plain',
    },
    'Hello world'
  );
  const responseRepository = new ResponseRepositoryFile({
    targetUrl: 'https://pokeapi.co/api/v2',
  });

  // When
  await responseRepository.persistResponseForRequest(
    inputRequest,
    inputResponse
  );

  const metadataContent = await fs.readJSON(
    `${OUTPUT_DIRECTORY}/get__text-${inputRequest.getComputedId()}/metadata.json`
  );
  const bodyContent = await fs.readFile(
    `${OUTPUT_DIRECTORY}/get__text-${inputRequest.getComputedId()}/body.txt`,
    'utf-8'
  );

  //Then
  expect(metadataContent).toEqual({
    status: 200,
    requestHeaders: {},
    responseHeaders: {
      'content-type': 'text/plain',
    },
  });
  expect(bodyContent).toEqual('Hello world');
});

it('should deserialize the response', async () => {
  // Given
  const inputRequest = new Request(
    'GET',
    '/pokemon/pikachu',
    {
      authorization: 'Bearer token',
    },
    ''
  );
  const inputResponse = new Response(
    200,
    {
      'content-type': 'application/json',
    },
    JSON.stringify({ id: 'user-1', name: 'John Doe' })
  );
  const responseRepository = new ResponseRepositoryFile({
    targetUrl: 'https://pokeapi.co/api/v2',
  });
  await responseRepository.persistResponseForRequest(
    inputRequest,
    inputResponse
  );

  // When
  const cachedResponse = await responseRepository.getResponseForRequest(
    inputRequest
  );

  //Then
  expect(cachedResponse).toEqual(inputResponse);
});
