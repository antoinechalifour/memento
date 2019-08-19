import path from 'path';

import { Request } from '../domain/entity';

export function getProjectDirectory(cacheDirectory: string, targetUrl: string) {
  const projectDir = targetUrl.replace(/[:\/]/g, '_').replace(/\./g, '-');

  return path.join(cacheDirectory, projectDir);
}

export function getRequestDirectory(
  cacheDirectory: string,
  targetUrl: string,
  request: Request
) {
  const projectDirectoryPath = getProjectDirectory(cacheDirectory, targetUrl);
  const trimmedUrl = request.url.slice(0, 16);
  const requestDirectoryPath = `${request.method.toLowerCase()}_${trimmedUrl.replace(
    /\//g,
    '_'
  )}-${request.id}`;

  return path.join(projectDirectoryPath, requestDirectoryPath);
}
