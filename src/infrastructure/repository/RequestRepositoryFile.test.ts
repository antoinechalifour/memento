import path from 'path';
import fs from 'fs-extra';

import { Request, Response } from '../../domain/entity';
import { RequestRepository } from '../../domain/repository';
import { getRequestDirectory } from '../../utils/path';
import { RequestRepositoryFile } from './RequestRepositoryFile';

const MEMENTO_CACHE_DIR = path.join(__dirname, '../../../.memento-test-cache');
const OUTPUT_DIRECTORY = `${MEMENTO_CACHE_DIR}/https___pokeapi-co_api_v2`;

function getRequestRepository() {
  return new RequestRepositoryFile({
    targetUrl: 'https://pokeapi.co/api/v2',
    cacheDirectory: MEMENTO_CACHE_DIR,
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
        const requestRepository = getRequestRepository();
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
          JSON.stringify({ id: 'user-1', name: 'John Doe' }),
          55
        );

        // When
        await requestRepository.persistResponseForRequest(
          inputRequest,
          inputResponse
        );

        const metadataContent = await fs.readJSON(
          `${OUTPUT_DIRECTORY}/get__pokemon_pikachu-${inputRequest.id}/metadata.json`
        );
        const bodyContent = await fs.readJSON(
          `${OUTPUT_DIRECTORY}/get__pokemon_pikachu-${inputRequest.id}/body.json`
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
          responseTime: 55,
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
        const requestRepository = getRequestRepository();
        const inputRequest = new Request('GET', '/notes', {}, '');
        const inputResponse = new Response(
          200,
          {
            'content-type': contentType,
          },
          '<Note><Author>Jane</Author><Content>Hello world</Content></Note>',
          55
        );

        // When
        await requestRepository.persistResponseForRequest(
          inputRequest,
          inputResponse
        );

        const metadataContent = await fs.readJSON(
          `${OUTPUT_DIRECTORY}/get__notes-${inputRequest.id}/metadata.json`
        );
        const bodyContent = await fs.readFile(
          `${OUTPUT_DIRECTORY}/get__notes-${inputRequest.id}/body.xml`,
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
          responseTime: 55,
        });
        expect(bodyContent).toEqual(
          '<Note><Author>Jane</Author><Content>Hello world</Content></Note>'
        );
      });
    });
  });

  it('should persist other types as txt with their meta data', async () => {
    // Given
    const requestRepository = getRequestRepository();
    const inputRequest = new Request('GET', '/text', {}, '');
    const inputResponse = new Response(
      200,
      {
        'content-type': 'text/plain',
      },
      'Hello world',
      66
    );

    // When
    await requestRepository.persistResponseForRequest(
      inputRequest,
      inputResponse
    );

    const metadataContent = await fs.readJSON(
      `${OUTPUT_DIRECTORY}/get__text-${inputRequest.id}/metadata.json`
    );
    const bodyContent = await fs.readFile(
      `${OUTPUT_DIRECTORY}/get__text-${inputRequest.id}/body.txt`,
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
      responseTime: 66,
    });
    expect(bodyContent).toEqual('Hello world');
  });

  it('should persist no content-type as txt with their meta data', async () => {
    // Given
    const requestRepository = getRequestRepository();
    const inputRequest = new Request('GET', '/text', {}, '');
    const inputResponse = new Response(200, {}, 'Hello world', 77);

    // When
    await requestRepository.persistResponseForRequest(
      inputRequest,
      inputResponse
    );

    const metadataContent = await fs.readJSON(
      `${OUTPUT_DIRECTORY}/get__text-${inputRequest.id}/metadata.json`
    );
    const bodyContent = await fs.readFile(
      `${OUTPUT_DIRECTORY}/get__text-${inputRequest.id}/body.txt`,
      'utf-8'
    );

    //Then
    expect(metadataContent).toEqual({
      method: 'GET',
      status: 200,
      url: '/text',
      requestBody: '',
      requestHeaders: {},
      responseHeaders: {},
      responseTime: 77,
    });
    expect(bodyContent).toEqual('Hello world');
  });

  it('should persist very long URLs (fixes #30)', async () => {
    // Given
    const requestRepository = getRequestRepository();
    const inputRequest = new Request(
      'GET',
      '/really_long_url?with=some&query=parameters[get__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_url]',
      {},
      ''
    );
    const inputResponse = new Response(200, {}, 'Hello world', 77);

    // When
    await requestRepository.persistResponseForRequest(
      inputRequest,
      inputResponse
    );

    const metadataContent = await fs.readJSON(
      `${OUTPUT_DIRECTORY}/get__really_long_url-${inputRequest.id}/metadata.json`
    );
    const bodyContent = await fs.readFile(
      `${OUTPUT_DIRECTORY}/get__really_long_url-${inputRequest.id}/body.txt`,
      'utf-8'
    );

    //Then
    expect(metadataContent).toEqual({
      method: 'GET',
      status: 200,
      url:
        '/really_long_url?with=some&query=parameters[get__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_url]',
      requestBody: '',
      requestHeaders: {},
      responseHeaders: {},
      responseTime: 77,
    });
    expect(bodyContent).toEqual('Hello world');
  });
});

describe('getResponseByRequestId', () => {
  let requestRepository: RequestRepository;

  beforeEach(async () => {
    requestRepository = getRequestRepository();

    await requestRepository.persistResponseForRequest(
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
        JSON.stringify({ id: 'user-1', name: 'John Doe' }),
        88
      )
    );
  });

  it('should deserialize the response', async () => {
    // When
    const cachedResponse = await requestRepository.getResponseByRequestId(
      new Request(
        'GET',
        '/pokemon/pikachu',
        {
          authorization: 'Bearer token',
        },
        ''
      ).id
    );

    //Then
    expect(cachedResponse).toEqual(
      new Response(
        200,
        {
          'content-type': 'application/json',
        },
        JSON.stringify({ id: 'user-1', name: 'John Doe' }),
        88
      )
    );
  });

  it('should return null when the request does not exist', async () => {
    // Given
    const requestId = 'does-not-exist';

    // When
    const response = await requestRepository.getResponseByRequestId(requestId);

    //Then
    expect(response).toBeNull();
  });

  it('should set the responseTime to 0 for older files', async () => {
    // Given
    const request = new Request(
      'GET',
      '/pokemon/pikachu',
      {
        authorization: 'Bearer token',
      },
      ''
    );
    const directory = getRequestDirectory(
      MEMENTO_CACHE_DIR,
      'https://pokeapi.co/api/v2',
      request
    );
    const metadataPath = path.join(directory, 'metadata.json');
    const metadata = await fs.readJSON(metadataPath);
    delete metadata['responseTime'];
    await fs.writeJson(metadataPath, metadata);

    // When
    const response = await requestRepository.getResponseByRequestId(request.id);

    // Then
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(response!.responseTimeInMs).toEqual(0);
  });
});

describe('getAllRequests', () => {
  let requestRepository: RequestRepository;

  beforeEach(async () => {
    requestRepository = getRequestRepository();

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
      }),
      99
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
      }),
      100
    );

    await Promise.all([
      requestRepository.persistResponseForRequest(request1, response1),
      requestRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should return the requests', async () => {
    // When
    const requests = await requestRepository.getAllRequests();

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
  let requestRepository: RequestRepository;

  beforeEach(async () => {
    requestRepository = getRequestRepository();

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
      }),
      110
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
      }),
      120
    );

    await Promise.all([
      requestRepository.persistResponseForRequest(request1, response1),
      requestRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should return the request when found', async () => {
    // Given
    const requestId = 'f8a26f76bdcf7d5b69d03c70c7d689727f1ec283';

    // When
    const request = await requestRepository.getRequestById(requestId);

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
    const request = await requestRepository.getRequestById(requestId);

    //Then
    expect(request).toEqual(null);
  });
});

describe('deleteAll', () => {
  let requestRepository: RequestRepository;

  beforeEach(async () => {
    requestRepository = getRequestRepository();

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
      }),
      130
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
      }),
      140
    );

    await Promise.all([
      requestRepository.persistResponseForRequest(request1, response1),
      requestRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should delete all requests', async () => {
    // Given
    const request1Id = 'fb5ca369347c9379a0c4535f1bafacb649320d77';
    const request2Id = 'f8a26f76bdcf7d5b69d03c70c7d689727f1ec283';
    const [request1Before, request2Before] = await Promise.all([
      requestRepository.getRequestById(request1Id),
      requestRepository.getRequestById(request2Id),
    ]);

    expect(request1Before).toBeTruthy();
    expect(request2Before).toBeTruthy();

    // When
    await requestRepository.deleteAll();

    //Then
    const [request1After, request2After] = await Promise.all([
      requestRepository.getRequestById(request1Id),
      requestRepository.getRequestById(request2Id),
    ]);
    expect(request1After).toBeNull();
    expect(request2After).toBeNull();
  });
});

describe('deleteByRequestId', () => {
  let requestRepository: RequestRepository;

  beforeEach(async () => {
    requestRepository = getRequestRepository();

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
      }),
      150
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
      }),
      160
    );

    await Promise.all([
      requestRepository.persistResponseForRequest(request1, response1),
      requestRepository.persistResponseForRequest(request2, response2),
    ]);
  });

  it('should delete the request', async () => {
    // Given
    const requestId = 'fb5ca369347c9379a0c4535f1bafacb649320d77';

    const request1Before = await requestRepository.getRequestById(requestId);
    expect(request1Before).toBeTruthy();

    // When
    await requestRepository.deleteByRequestId(requestId);
    const request1After = await requestRepository.getRequestById(requestId);

    //Then
    expect(request1After).toBeNull();
  });
});
