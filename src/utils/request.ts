import { parse as parseUrl } from 'url';
import parseCurl from 'parse-curl';

import { Request, Method } from '../domain/entity';

function addLeadingSlashIfNecessary(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function getUrlPath(url: string) {
  return parseUrl(url).path || '';
}

export function createRequestFromCurl(curlCommand: string, targetUrl: string) {
  const parsedCommand = parseCurl(curlCommand);

  const targetUrlPath = getUrlPath(targetUrl);
  const curlUrlPath = getUrlPath(parsedCommand.url);
  const url = curlUrlPath.replace(targetUrlPath, '');

  return new Request(
    parsedCommand.method as Method,
    addLeadingSlashIfNecessary(url || ''),
    parsedCommand.header,
    parsedCommand.body || ''
  );
}
