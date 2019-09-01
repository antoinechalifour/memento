import fs from 'fs-extra';
import path from 'path';

import { Request } from '../../domain/entity';
import { RequestRepositoryFile } from '../../infrastructure/repository';
import { getProjectDirectory } from '../../utils/path';

export interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
}

/**
 * Returns the legacy directory name pattern.
 * Ex: given a GET request on /test/very_long_url?with=params
 * Would return: "get_test_very_long_url?with=params"
 *
 * (Which is not valid on windows; thus this migration!)
 */
function getOldRequestDirectoryName(request: Request) {
  const trimmedUrl = request.url.slice(0, 16);
  return `${request.method.toLowerCase()}_${trimmedUrl.replace(/\//g, '_')}-${
    request.id
  }`;
}

function getNewRequestDirectoryname(request: Request) {
  return request.id;
}

/**
 * Migrates the cache directory for each request to a directory named after the request id.
 */
export async function moveRequestsToIdDirectories({
  targetUrl,
  cacheDirectory,
}: Dependencies) {
  const projectDirectoryPath = getProjectDirectory(cacheDirectory, targetUrl);
  const requestRepository = new RequestRepositoryFile({
    targetUrl,
    cacheDirectory,
  });

  // Get a list of all requests to check / migrate
  const allRequests = await requestRepository.getAllRequests();

  for (const request of allRequests) {
    // Get the old directory name
    const oldRequestDirectoryName = getOldRequestDirectoryName(request);
    const oldDirectory = path.join(
      projectDirectoryPath,
      oldRequestDirectoryName
    );
    const oldDirectoryExists = await fs.pathExists(oldDirectory);

    // If this directory exists, move it to the new pattern
    if (oldDirectoryExists) {
      const newRequestDirectoryName = getNewRequestDirectoryname(request);
      const newDirectory = path.join(
        projectDirectoryPath,
        newRequestDirectoryName
      );
      await fs.move(oldDirectory, newDirectory);
    }
  }
}
