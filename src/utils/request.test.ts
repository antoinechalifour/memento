import { Request } from '../domain/entity';
import { createRequestFromCurl } from './request';

describe('createRequestFromCurl', () => {
  // Most of the tests are inspired by https://github.com/tj/parse-curl.js/blob/master/test.js
  const CURL_CASES = [
    {
      curl: 'curl http://localhost:8080/get-request',
      targetUrl: 'http://localhost:8080',
      expected: new Request('GET', '/get-request', {}, ''),
    },
    {
      curl: 'curl http://localhost:8080/api/v2/get-request',
      targetUrl: 'http://localhost:8080/api/v2',
      expected: new Request('GET', '/get-request', {}, ''),
    },
    {
      curl: 'curl http://localhost:8080/api/v2/get-request',
      targetUrl: 'http://localhost:8080/api/v2/',
      expected: new Request('GET', '/get-request', {}, ''),
    },
    {
      curl: 'curl http://example.com/api/v2/get-request',
      targetUrl: 'http://localhost:8080/api/v2',
      expected: new Request('GET', '/get-request', {}, ''),
    },
    {
      curl: 'curl http://localhost:8080/get-request?foo=bar',
      targetUrl: 'http://localhost:8080',
      expected: new Request('GET', '/get-request?foo=bar', {}, ''),
    },
    {
      curl: 'curl -I http://localhost:8080/head-request',
      targetUrl: 'http://localhost:8080',
      expected: new Request('HEAD', '/head-request', {}, ''),
    },
    {
      curl:
        'curl -I http://localhost:8080/head-request  -vvv --foo --whatever bar',
      targetUrl: 'http://localhost:8080',
      expected: new Request('HEAD', '/head-request', {}, ''),
    },
    {
      curl:
        'curl -H "Origin: http://test.example.com" http://localhost:8080/get-request',
      targetUrl: 'http://localhost:8080',
      expected: new Request(
        'GET',
        '/get-request',
        {
          origin: 'http://test.example.com',
        },
        ''
      ),
    },
    {
      curl: 'curl http://localhost:8080/get-request  --compressed',
      targetUrl: 'http://localhost:8080',
      expected: new Request('GET', '/get-request', {}, ''),
    },
    {
      curl:
        'curl -H "Accept-Encoding: gzip" http://localhost:8080/get-request  --compressed',
      targetUrl: 'http://localhost:8080',
      expected: new Request('GET', '/get-request', {}, ''),
    },
    {
      curl: 'curl -X DELETE http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request('DELETE', '/api/beers/2', {}, ''),
    },
    {
      curl: 'curl -X delete http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request('delete', '/api/beers/2', {}, ''),
    },
    {
      curl: 'curl -XPUT http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request('PUT', '/api/beers/2', {}, ''),
    },
    {
      curl: 'curl -d "foo=bar" http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request(
        'POST',
        '/api/beers/2',
        {
          'content-type': 'application/x-www-form-urlencoded',
        },
        'foo=bar'
      ),
    },
    {
      curl: 'curl -d "foo=bar" -d bar=baz http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request(
        'POST',
        '/api/beers/2',
        {
          'content-type': 'application/x-www-form-urlencoded',
        },
        'foo=bar&bar=baz'
      ),
    },
    {
      curl:
        'curl -H "Accept: text/plain" --header "User-Agent: memento" http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request(
        'GET',
        '/api/beers/2',
        {
          Accept: 'text/plain',
          'User-Agent': 'memento',
        },
        ''
      ),
    },
    {
      curl: 'curl -b "foo=bar" http://localhost:8080/api/beers/2',
      targetUrl: 'http://localhost:8080',
      expected: new Request(
        'GET',
        '/api/beers/2',
        {
          'set-cookie': 'foo=bar',
        },
        ''
      ),
    },
    {
      curl:
        'curl --header "Content-Type: application/json" --request POST --data \'{"username":"xyz","password":"xyz"}\' http://localhost:8080/api/login',
      targetUrl: 'http://localhost:8080',
      expected: new Request(
        'POST',
        '/api/login',
        {
          'content-type': 'application/json',
        },
        '{"username":"xyz","password":"xyz"}'
      ),
    },
  ];

  CURL_CASES.forEach(test =>
    it(`should return the parsed request for ${test.curl}`, () => {
      // Given
      const curl = test.curl;

      // When
      const result = createRequestFromCurl(curl, test.targetUrl);

      // Then
      expect(result).toEqual(test.expected);
    })
  );
});
