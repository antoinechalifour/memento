import supertest from 'supertest';
import nock from 'nock';
import { Server } from 'http';

import { getTestApplication } from './utils';

let request: supertest.SuperTest<supertest.Test>;
let networkSpy: jest.SpyInstance;
let targetUrl: string;
let server: Server;

const HTTP_METHODS = ['post', 'put', 'patch'] as const;

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

HTTP_METHODS.forEach(methodName =>
  describe(`HTTP ${methodName}`, () => {
    describe('content-type: application/json', () => {
      beforeEach(() => {
        nock(`${targetUrl}`)
          [methodName]('/json', { name: 'John' })
          .reply(201, 'OK');
      });

      it('should forward the response', async () => {
        // When
        const responseFromNetwork = await request[methodName]('/json').send({
          name: 'John',
        });
        const responseFromCache = await request[methodName]('/json').send({
          name: 'John',
        });

        // Then
        expect(responseFromNetwork.status).toBe(201);
        expect(responseFromNetwork.header['content-type']).toEqual(
          'text/plain; charset=utf-8'
        );
        expect(responseFromNetwork.text).toEqual('OK');

        expect(responseFromCache.status).toBe(201);
        expect(responseFromCache.header['content-type']).toEqual(
          'text/plain; charset=utf-8'
        );
        expect(responseFromCache.text).toEqual('OK');

        expect(networkSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('content-type: x-www-form-urlencoded', () => {
      beforeEach(() => {
        nock(`${targetUrl}`)
          [methodName]('/x-www-form-urlencoded', 'name=John')
          .reply(201, 'OK');
      });

      it('should forward the response', async () => {
        // When
        const responseFromNetwork = await request[methodName](
          '/x-www-form-urlencoded'
        ).send('name=John');
        const responseFromCache = await request[methodName](
          '/x-www-form-urlencoded'
        ).send('name=John');

        // Then
        expect(responseFromNetwork.status).toBe(201);
        expect(responseFromNetwork.header['content-type']).toEqual(
          'text/plain; charset=utf-8'
        );
        expect(responseFromNetwork.text).toEqual('OK');

        expect(responseFromCache.status).toBe(201);
        expect(responseFromCache.header['content-type']).toEqual(
          'text/plain; charset=utf-8'
        );
        expect(responseFromCache.text).toEqual('OK');

        expect(networkSpy).toHaveBeenCalledTimes(1);
      });
    });
  })
);
