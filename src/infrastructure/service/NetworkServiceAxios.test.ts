import axios from 'axios';
import lolex from 'lolex';

import { getTestConfiguration } from '../../test-utils/config';
import { Request, Response } from '../../domain/entity';
import { NetworkServiceAxios } from './NetworkServiceAxios';

jest.mock('axios');

describe('Headers handling', () => {
  it('should not forward hop-by-hop request headers', async () => {
    // Given
    ((axios as any) as jest.Mock).mockResolvedValue({
      status: 200,
      headers: {},
      data: 'Ok',
    });
    const request = new Request(
      'GET',
      '/toto',
      {
        AUTHORIZATION: 'authorization',
        'PROXY-AUTHORIZATION': 'proxy-authorization',
        ACCEPT: 'accept',
        'ACCEPT-CHARSET': 'accept-charset',
        'ACCEPT-LANGUAGE': 'accept-language',
        EXPECT: 'expect',
        COOKIE: 'cookie',
        'CACHE-CONTROL': 'cache-control',
        'IF-MATCH': 'if-match',
        'IF-NONE-MATCH': 'if-none-match',
        'IF-MODIFIED-MATCH': 'if-modified-match',
        'IF-UNMODIFIED-MATCH': 'if-unmodified-match',
        DNT: 'dnt',
        TK: 'tk',
        FROM: 'from',
        REFERER: 'referer',
        'REFERRER-POLICY': 'referrer-policy',
        'USER-AGENT': 'user-agent',
        'ACCEPT-RANGES': 'accept-ranges',
        RANGE: 'range',
        'IF-RANGE': 'if-range',
        'CONTENT-RANGE': 'content-range',
        'UPGRADE-INSECURE-REQUESTS': 'upgrade-insecure-requests',
        HOST: 'host',
        UPGRADE: 'upgrade',
        'ACCEPT-ENCODING': 'accept-encoding',
        'PROXY-AUTHENTICATE': 'proxy-authenticate',
        'X-CUSTOM-HEADER': 'x-custom-header',
      },
      ''
    );
    const networkService = new NetworkServiceAxios({
      config: getTestConfiguration({
        targetUrl: 'http://localhost',
      }),
    });

    // When
    await networkService.executeRequest(request);

    //Then
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          authorization: 'authorization',
          'proxy-authorization': 'proxy-authorization',
          accept: 'accept',
          'accept-charset': 'accept-charset',
          'accept-language': 'accept-language',
          expect: 'expect',
          cookie: 'cookie',
          dnt: 'dnt',
          tk: 'tk',
          from: 'from',
          referer: 'referer',
          'referrer-policy': 'referrer-policy',
          'user-agent': 'user-agent',
          'accept-ranges': 'accept-ranges',
          range: 'range',
          'if-range': 'if-range',
          'content-range': 'content-range',
          'upgrade-insecure-requests': 'upgrade-insecure-requests',
          'x-custom-header': 'x-custom-header',
        },
      })
    );
  });

  it('should not forward response headers handled by memento', async () => {
    // Given
    ((axios as any) as jest.Mock).mockResolvedValue({
      status: 200,
      headers: {
        'WWW-AUTHENTICATE': 'www-authenticate',
        AGE: 'age',
        'CACHE-CONTROL': 'cache-control',
        'CLEAR-SITE-DATA': 'clear-site-data',
        EXPIRES: 'expires',
        PRAGMA: 'pragma',
        WARNING: 'warning',
        'LAST-MODIFIED': 'last-modified',
        ETAG: 'etag',
        VARY: 'vary',
        CONNECTION: 'connection',
        'KEEP-ALIVE': 'keep-alive',
        'SET-COOKIE': 'set-cookie',
        'ACCESS-CONTROL-ALLOW-ORIGIN': 'access-control-allow-origin',
        'ACCESS-CONTROL-ALLOW-CREDENTIALS': 'access-control-allow-credentials',
        'ACCESS-CONTROL-ALLOW-HEADERS': 'access-control-allow-headers',
        'ACCESS-CONTROL-ALLOW-METHODS': 'access-control-allow-methods',
        'ACCESS-CONTROL-EXPOSE-HEADERS': 'access-control-expose-headers',
        'ACCESS-CONTROL-MAX-AGE': 'access-control-max-age',
        'ACCESS-CONTROL-REQUEST-HEADERS': 'access-control-request-headers',
        'ACCESS-CONTROL-REQUEST-METHOD': 'access-control-request-method',
        ORIGIN: 'origin',
        'CONTENT-DISPOSITION': 'content-disposition',
        'CONTENT-LENGTH': 'content-length',
        'CONTENT-TYPE': 'content-type',
        'CONTENT-ENCODING': 'content-encoding',
        'CONTENT-LANGUAGE': 'content-language',
        'CONTENT-LOCATION': 'content-location',
        LOCATION: 'location',
        FORWARDED: 'forwarded',
        VIA: 'via',
        ALLOW: 'allow',
        SERVER: 'server',
        'CROSS-ORIGIN-OPENER-POLICY': 'cross-origin-opener-policy',
        'CROSS-ORIGIN-RESOURCE-POLICY': 'cross-origin-resource-policy',
        'CONTENT-SECURITY-POLICY': 'content-security-policy',
        'content-security-policy-report-only':
          'content-security-policy-report-only',
        'EXPECT-CT': 'expect-ct',
        'FEATURE-POLICY': 'feature-policy',
        'PUBLIC-KEY-PINS': 'public-key-pins',
        'PUBLIC-KEY-PINS-REPORT-ONLY': 'public-key-pins-report-only',
        'STRICT-TRANSPORT-SECURITY': 'strict-transport-security',
        'TRANSFER-ENCODING': 'transfer-encoding',
        TE: 'te',
        TRAILER: 'trailer',
        'ALT-SVC': 'alt-svc',
        DATE: 'date',
        'LARGE-ALLOCATION': 'large-allocation',
        LINK: 'link',
        'RETRY-AFTER': 'retry-after',
        'SERVER-TIMING': 'server-timing',
        SOURCEMAP: 'sourcemap',
        UPGRADE: 'upgrade',
      },
      data: 'Ok',
    });
    const request = new Request('GET', '/toto', {}, '');
    const networkService = new NetworkServiceAxios({
      config: getTestConfiguration(),
    });

    // When
    const response = await networkService.executeRequest(request);

    //Then
    expect(response.headers).toEqual({
      'www-authenticate': 'www-authenticate',
      age: 'age',
      'cache-control': 'cache-control',
      'clear-site-data': 'clear-site-data',
      expires: 'expires',
      pragma: 'pragma',
      warning: 'warning',
      'last-modified': 'last-modified',
      etag: 'etag',
      vary: 'vary',
      'content-disposition': 'content-disposition',
      'content-length': 'content-length',
      'content-type': 'content-type',
      'content-language': 'content-language',
      'content-location': 'content-location',
      location: 'location',
      allow: 'allow',
      server: 'server',
      'cross-origin-opener-policy': 'cross-origin-opener-policy',
      'cross-origin-resource-policy': 'cross-origin-resource-policy',
      'content-security-policy': 'content-security-policy',
      'content-security-policy-report-only':
        'content-security-policy-report-only',
      'expect-ct': 'expect-ct',
      'feature-policy': 'feature-policy',
      'public-key-pins': 'public-key-pins',
      'public-key-pins-report-only': 'public-key-pins-report-only',
      'strict-transport-security': 'strict-transport-security',
      'alt-svc': 'alt-svc',
      date: 'date',
      'large-allocation': 'large-allocation',
      link: 'link',
      'retry-after': 'retry-after',
      'server-timing': 'server-timing',
      sourcemap: 'sourcemap',
    });
  });

  it('should clean cookies according to the policy', async () => {
    // Given
    ((axios as any) as jest.Mock).mockResolvedValue({
      status: 200,
      headers: {
        'SET-COOKIE': [
          '_ga=value1; Path=/; Secure',
          'test=value2; Path=/; secure',
          '_gid=value3; Path=/',
        ],
      },
      data: 'Ok',
    });
    const request = new Request('GET', '/toto', {}, '');
    const networkService = new NetworkServiceAxios({
      config: getTestConfiguration({
        ignoreCookiesPattern: /AMP_TOKEN|_ga.*|_gid/gi,
      }),
    });

    // When
    const response = await networkService.executeRequest(request);

    //Then
    expect(response.cookies).toEqual(['test=value2; Path=/']);
  });
});

describe('error handling', () => {
  let clock: lolex.Clock;

  beforeEach(() => {
    clock = lolex.install();
  });

  afterEach(() => {
    // @ts-ignore
    clock.uninstall();
  });

  it('should throw an error when the error does not have a response', async () => {
    expect.assertions(1);
    // Given
    ((axios as any) as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );
    const request = new Request(
      'GET',
      '/test',
      {
        authorization: 'bearer token',
      },
      ''
    );
    const networkService = new NetworkServiceAxios({
      config: getTestConfiguration(),
    });

    // When
    try {
      await networkService.executeRequest(request);
    } catch (err) {
      // Then
      expect(err).toBeDefined();
    }
  });

  it('should return a response when the error has a response', async () => {
    // Given
    const error = new Error('Failed to fetch');
    // @ts-ignore
    error.response = {
      status: 200,
      headers: {},
      data: Buffer.from('Ok'),
    };
    ((axios as any) as jest.Mock).mockImplementation(() => {
      clock.tick(36);

      return Promise.reject(error);
    });

    const request = new Request(
      'GET',
      '/test',
      {
        authorization: 'bearer token',
      },
      ''
    );
    const networkService = new NetworkServiceAxios({
      config: getTestConfiguration(),
    });

    // When
    const response = await networkService.executeRequest(request);

    // Then
    expect(response).toEqual(new Response(200, {}, Buffer.from('Ok'), 36));
  });
});
