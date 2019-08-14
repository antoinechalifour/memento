import { Headers } from '../../domain/entity';

export function buildRequestHeaders(inputHeaders: Headers): Headers {
  const HOP_BY_HOP_HEADERS = [
    'proxy-authenticate',
    'upgrade',
    'host',
    'accept-encoding',
    'content-length',
  ];
  const headers: Headers = {};
  Object.keys(inputHeaders).forEach(key => {
    if (HOP_BY_HOP_HEADERS.includes(key.toLowerCase())) {
      return;
    }
    headers[key.toLowerCase()] = inputHeaders[key];
  });
  return headers;
}
export function buildResponseHeaders(inputHeaders: Headers): Headers {
  const EXCLUDED_HEADERS = [
    'connection',
    'keep-alive',
    'access-control-allow-origin',
    'access-control-allow-credentials',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-expose-headers',
    'access-control-max-age',
    'access-control-request-headers',
    'access-control-request-method',
    'origin',
    'content-encoding',
    'forwarded',
    'via',
    'transfer-encoding',
    'te',
    'trailer',
    'upgrade',
  ];
  const headers: Headers = {};
  Object.keys(inputHeaders).forEach(key => {
    if (EXCLUDED_HEADERS.includes(key.toLocaleLowerCase())) {
      return;
    }
    headers[key.toLowerCase()] = inputHeaders[key];
  });
  return headers;
}
