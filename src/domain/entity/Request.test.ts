import hashObject from 'object-hash';

import { Request } from './Request';

jest.mock('object-hash');

describe('getComputedId', () => {
  beforeEach(() => {
    ((hashObject as unknown) as jest.Mock).mockImplementation(object =>
      JSON.stringify(object)
    );
  });

  it('return a hash based on the request properties', () => {
    // Given
    const request = new Request(
      'GET',
      '/api/beers',
      { authorization: 'Bearer token' },
      'some json'
    );

    // When
    const id = request.getComputedId();

    //Then
    expect(id).toEqual(
      '{"method":"GET","url":"/api/beers","body":"some json","authorization":"Bearer token"}'
    );
  });
});

describe('headers', () => {
  it('should remove hop-by-hop headers', () => {
    // Given
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

    // When
    const headers = request.headers;

    //Then
    expect(headers).toEqual({
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
    });
  });
});
