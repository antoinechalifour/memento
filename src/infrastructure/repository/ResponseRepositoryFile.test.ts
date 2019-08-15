import path from 'path';
import fs from 'fs-extra';

import { Request, Response } from '../../domain/entity';
import { ResponseRepositoryFile } from './ResponseRepositoryFile';
import { ResponseRepository } from 'domain/repository';

const MEMENTO_CACHE_DIR = path.join(__dirname, '../../../.memento-cache');
const OUTPUT_DIRECTORY = `${MEMENTO_CACHE_DIR}/https___pokeapi-co_api_v2`;

function getResponseRepository() {
  return new ResponseRepositoryFile({
    targetUrl: 'https://pokeapi.co/api/v2',
  });
}

beforeEach(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

afterAll(() => {
  fs.removeSync(MEMENTO_CACHE_DIR);
});

describe('persistResponseForRequest', () => {
  describe('JSON support', () => {
    const CASES = [
      'APPLICATION/JSON',
      'application/json',
      'application/json; chartset=UTF-8;',
    ];

    CASES.forEach(contentType => {
      it(`should persist the ${contentType} response and its meta data`, async () => {
        // Given
        const responseRepository = getResponseRepository();
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
          method: 'GET',
          url: '/pokemon/pikachu',
          requestBody: '',
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
    const CASES = [
      'APPLICATION/XML',
      'application/xml',
      'TEXT/XML',
      'text/xml',
    ];

    CASES.forEach(contentType => {
      it(`should persist the ${contentType} response and its meta data`, async () => {
        // Given
        const responseRepository = getResponseRepository();
        const inputRequest = new Request('GET', '/notes', {}, '');
        const inputResponse = new Response(
          200,
          {
            'content-type': contentType,
          },
          '<Note><Author>Jane</Author><Content>Hello world</Content></Note>'
        );

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
          method: 'GET',
          url: '/notes',
          requestBody: '',
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
    const responseRepository = getResponseRepository();
    const inputRequest = new Request('GET', '/text', {}, '');
    const inputResponse = new Response(
      200,
      {
        'content-type': 'text/plain',
      },
      'Hello world'
    );

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
      method: 'GET',
      status: 200,
      url: '/text',
      requestBody: '',
      requestHeaders: {},
      responseHeaders: {
        'content-type': 'text/plain',
      },
    });
    expect(bodyContent).toEqual('Hello world');
  });
});

describe('getResponseForRequest', () => {
  let responseRepository: ResponseRepository;

  beforeEach(async () => {
    responseRepository = getResponseRepository();

    await responseRepository.persistResponseForRequest(
      new Request(
        'GET',
        '/pokemon/pikachu',
        {
          authorization: 'Bearer token',
        },
        ''
      ),
      new Response(
        200,
        {
          'content-type': 'application/json',
        },
        JSON.stringify({ id: 'user-1', name: 'John Doe' })
      )
    );
  });

  it('should deserialize the response', async () => {
    // When
    const cachedResponse = await responseRepository.getResponseForRequest(
      new Request(
        'GET',
        '/pokemon/pikachu',
        {
          authorization: 'Bearer token',
        },
        ''
      )
    );

    //Then
    expect(cachedResponse).toEqual(
      new Response(
        200,
        {
          'content-type': 'application/json',
        },
        JSON.stringify({ id: 'user-1', name: 'John Doe' })
      )
    );
  });
});

describe('getAllRequests', () => {
  let responseRepository: ResponseRepository;

  beforeEach(async () => {
    responseRepository = getResponseRepository();

    const request1 = new Request(
      'post',
      '/pokemon',
      {
        'x-custom-1': 'header-1',
      },
      JSON.stringify({
        name: 'Bulbasaur',
      })
    );
    const response1 = new Response(
      201,
      {
        'content-type': 'application/json',
        'x-custom-2': 'header-2',
      },
      JSON.stringify({
        id: 'pokemon-1',
        name: 'Bulbasaur',
      })
    );
    const request2 = new Request(
      'get',
      '/pokemon/mew',
      {
        'x-custom-3': 'header-3',
      },
      ''
    );
    const response2 = new Response(
      200,
      {
        'content-type': 'application/json',
        'x-custom-4': 'header-4',
      },
      JSON.stringify({
        id: 'pokemon-151',
        name: 'Mew',
      })
    );

    await Promise.all([
      responseRepository.persistResponseForRequest(request1, response1),
      responseRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should return the requests', async () => {
    // When
    const requests = await responseRepository.getAllRequests();

    //Then
    expect(requests).toEqual([
      new Request(
        'get',
        '/pokemon/mew',
        {
          'x-custom-3': 'header-3',
        },
        ''
      ),
      new Request(
        'post',
        '/pokemon',
        {
          'x-custom-1': 'header-1',
        },
        JSON.stringify({
          name: 'Bulbasaur',
        })
      ),
    ]);
  });
});

describe('getRequestById', () => {
  let responseRepository: ResponseRepository;

  beforeEach(async () => {
    responseRepository = getResponseRepository();

    const request1 = new Request(
      'post',
      '/pokemon',
      {
        'x-custom-1': 'header-1',
      },
      JSON.stringify({
        name: 'Bulbasaur',
      })
    );
    const response1 = new Response(
      201,
      {
        'content-type': 'application/json',
        'x-custom-2': 'header-2',
      },
      JSON.stringify({
        id: 'pokemon-1',
        name: 'Bulbasaur',
      })
    );
    const request2 = new Request(
      'get',
      '/pokemon/mew',
      {
        'x-custom-3': 'header-3',
      },
      ''
    );
    const response2 = new Response(
      200,
      {
        'content-type': 'application/json',
        'x-custom-4': 'header-4',
      },
      JSON.stringify({
        id: 'pokemon-151',
        name: 'Mew',
      })
    );

    await Promise.all([
      responseRepository.persistResponseForRequest(request1, response1),
      responseRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should return the request when found', async () => {
    // Given
    const requestId = 'f8a26f76bdcf7d5b69d03c70c7d689727f1ec283';

    // When
    const request = await responseRepository.getRequestById(requestId);

    //Then
    expect(request).toEqual(
      new Request(
        'post',
        '/pokemon',
        {
          'x-custom-1': 'header-1',
        },
        JSON.stringify({
          name: 'Bulbasaur',
        })
      )
    );
  });

  it('should return null when not found', async () => {
    // Given
    const requestId = 'not-found-id';

    // When
    const request = await responseRepository.getRequestById(requestId);

    //Then
    expect(request).toEqual(null);
  });
});

describe('deleteAll', () => {
  let responseRepository: ResponseRepository;

  beforeEach(async () => {
    responseRepository = getResponseRepository();

    const request1 = new Request(
      'post',
      '/pokemon',
      {
        'x-custom-1': 'header-1',
      },
      JSON.stringify({
        name: 'Bulbasaur',
      })
    );
    const response1 = new Response(
      201,
      {
        'content-type': 'application/json',
        'x-custom-2': 'header-2',
      },
      JSON.stringify({
        id: 'pokemon-1',
        name: 'Bulbasaur',
      })
    );
    const request2 = new Request(
      'get',
      '/pokemon/mew',
      {
        'x-custom-3': 'header-3',
      },
      ''
    );
    const response2 = new Response(
      200,
      {
        'content-type': 'application/json',
        'x-custom-4': 'header-4',
      },
      JSON.stringify({
        id: 'pokemon-151',
        name: 'Mew',
      })
    );

    await Promise.all([
      responseRepository.persistResponseForRequest(request1, response1),
      responseRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should delete all requests', async () => {
    // Given
    const request1Id = 'fb5ca369347c9379a0c4535f1bafacb649320d77';
    const request2Id = 'f8a26f76bdcf7d5b69d03c70c7d689727f1ec283';
    const [request1Before, request2Before] = await Promise.all([
      responseRepository.getRequestById(request1Id),
      responseRepository.getRequestById(request2Id),
    ]);

    expect(request1Before).toBeTruthy();
    expect(request2Before).toBeTruthy();

    // When
    await responseRepository.deleteAll();

    //Then
    const [request1After, request2After] = await Promise.all([
      responseRepository.getRequestById(request1Id),
      responseRepository.getRequestById(request2Id),
    ]);
    expect(request1After).toBeNull();
    expect(request2After).toBeNull();
  });
});

describe('deleteByRequestId', () => {
  let responseRepository: ResponseRepository;

  beforeEach(async () => {
    responseRepository = getResponseRepository();

    const request1 = new Request(
      'post',
      '/pokemon',
      {
        'x-custom-1': 'header-1',
      },
      JSON.stringify({
        name: 'Bulbasaur',
      })
    );
    const response1 = new Response(
      201,
      {
        'content-type': 'application/json',
        'x-custom-2': 'header-2',
      },
      JSON.stringify({
        id: 'pokemon-1',
        name: 'Bulbasaur',
      })
    );
    const request2 = new Request(
      'get',
      '/pokemon/mew',
      {
        'x-custom-3': 'header-3',
      },
      ''
    );
    const response2 = new Response(
      200,
      {
        'content-type': 'application/json',
        'x-custom-4': 'header-4',
      },
      JSON.stringify({
        id: 'pokemon-151',
        name: 'Mew',
      })
    );

    await Promise.all([
      responseRepository.persistResponseForRequest(request1, response1),
      responseRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should delete the request', async () => {
    // Given
    const requestId = 'fb5ca369347c9379a0c4535f1bafacb649320d77';

    const request1Before = await responseRepository.getRequestById(requestId);
    expect(request1Before).toBeTruthy();

    // When
    await responseRepository.deleteByRequestId(requestId);
    const request1After = await responseRepository.getRequestById(requestId);

    //Then
    expect(request1After).toBeNull();
  });
});
