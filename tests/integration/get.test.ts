import { Server } from 'http';
import supertest from 'supertest';
import nock from 'nock';

import { getTestApplication } from './utils';

let request: supertest.SuperTest<supertest.Test>;
let networkSpy: jest.SpyInstance;
let targetUrl: string;
let server: Server;

beforeAll(() => {
  const testApplication = getTestApplication();

  request = testApplication.request;
  networkSpy = testApplication.spies.networkService;
  targetUrl = testApplication.targetUrl;
  server = testApplication.server;
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  networkSpy.mockClear();
});

describe('2xx success / Plain text', () => {
  beforeEach(() => {
    nock(`${targetUrl}`)
      .get('/get-test-201')
      .reply(201, 'Hello world', {
        'content-type': 'text/plain; charset=utf-8',
      });
  });

  it('should forward the response', async () => {
    // When
    const responseFromNetwork = await request.get('/get-test-201');
    const responseFromCache = await request.get('/get-test-201');

    // Then
    expect(responseFromNetwork.status).toBe(201);
    expect(responseFromNetwork.header['content-type']).toEqual(
      'text/plain; charset=utf-8'
    );
    expect(responseFromNetwork.text).toEqual('Hello world');

    expect(responseFromCache.status).toBe(201);
    expect(responseFromCache.header['content-type']).toEqual(
      'text/plain; charset=utf-8'
    );
    expect(responseFromCache.text).toEqual('Hello world');

    expect(networkSpy).toHaveBeenCalledTimes(1);
  });
});

describe('2xx success / JSON', () => {
  beforeEach(() => {
    nock(`${targetUrl}`)
      .get('/json')
      .reply(
        200,
        [
          {
            id: 'user-1',
            name: 'Sarah Walker',
          },
          {
            id: 'user-2',
            name: 'John Doe',
          },
        ],
        {
          'content-type': 'application/json; charset=utf-8',
        }
      );
  });

  it('should forward the response', async () => {
    // When
    const responseFromNetwork = await request.get('/json');
    const responseFromCache = await request.get('/json');

    // Then
    expect(responseFromNetwork.status).toBe(200);
    expect(responseFromNetwork.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    expect(responseFromNetwork.body).toEqual([
      {
        id: 'user-1',
        name: 'Sarah Walker',
      },
      {
        id: 'user-2',
        name: 'John Doe',
      },
    ]);

    expect(responseFromCache.status).toBe(200);
    expect(responseFromCache.header['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
    expect(responseFromCache.body).toEqual([
      {
        id: 'user-1',
        name: 'Sarah Walker',
      },
      {
        id: 'user-2',
        name: 'John Doe',
      },
    ]);

    expect(networkSpy).toHaveBeenCalledTimes(1);
  });
});

describe('2xx success / XML', () => {
  beforeEach(() => {
    nock(`${targetUrl}`)
      .get('/xml')
      .reply(
        200,
        "<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>",
        {
          'content-type': 'application/xml; charset=utf-8',
        }
      );
  });

  it('should forward the response', async () => {
    // When
    const responseFromNetwork = await request.get('/xml');
    const responseFromCache = await request.get('/xml');

    // Then
    expect(responseFromNetwork.status).toBe(200);
    expect(responseFromNetwork.header['content-type']).toEqual(
      'application/xml; charset=utf-8'
    );
    expect(responseFromNetwork.text).toEqual(
      "<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>"
    );

    expect(responseFromCache.status).toBe(200);
    expect(responseFromCache.header['content-type']).toEqual(
      'application/xml; charset=utf-8'
    );
    expect(responseFromCache.text).toEqual(
      "<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>"
    );

    expect(networkSpy).toHaveBeenCalledTimes(1);
  });
});

describe('2xx success / Headers check', () => {
  beforeEach(() => {
    nock(`${targetUrl}`)
      .get('/get-test-header')
      .matchHeader('Authorization', 'Bearer access-token')
      .reply(200, 'Hello world', {
        'content-type': 'text/plain',
        'x-custom-header': 'Response header example',
      });
  });

  it('should forward the response', async () => {
    // When
    const responseFromNetwork = await request
      .get('/get-test-header')
      .set('Authorization', 'Bearer access-token');
    const responseFromCache = await request
      .get('/get-test-header')
      .set('Authorization', 'Bearer access-token');

    // Then
    expect(responseFromNetwork.header['x-custom-header']).toEqual(
      'Response header example'
    );

    expect(responseFromCache.header['x-custom-header']).toEqual(
      'Response header example'
    );

    expect(networkSpy).toHaveBeenCalledTimes(1);
  });
});

describe('4xx errors / Plain text', () => {
  beforeEach(() => {
    nock(`${targetUrl}`)
      .get('/get-test-403')
      .reply(403, 'Not authorized', { 'content-type': 'text/plain' });
  });

  it('should forward the response', async () => {
    // When
    const responseFromNetwork = await request.get('/get-test-403');
    const responseFromCache = await request.get('/get-test-403');

    // Then
    expect(responseFromNetwork.status).toBe(403);
    expect(responseFromNetwork.text).toEqual('Not authorized');

    expect(responseFromCache.status).toBe(403);
    expect(responseFromCache.text).toEqual('Not authorized');

    expect(networkSpy).toHaveBeenCalledTimes(1);
  });
});
