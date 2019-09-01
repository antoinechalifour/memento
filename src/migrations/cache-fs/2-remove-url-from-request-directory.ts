import fs from 'fs-extra';
import path from 'path';

import { RequestRepositoryFile } from '../../infrastructure/repository';
import { getProjectDirectory } from '../../utils/path';

export interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
}

export async function moveRequestsToIdDirectories({
  targetUrl,
  cacheDirectory,
}: Dependencies) {
  const requestRepository = new RequestRepositoryFile({
    targetUrl,
    cacheDirectory,
  });
  const projectDirectoryPath = getProjectDirectory(cacheDirectory, targetUrl);
  const allRequests = await requestRepository.getAllRequests();

  for (const request of allRequests) {
    const trimmedUrl = request.url.slice(0, 16);
    const requestDirectoryPath = `${request.method.toLowerCase()}_${trimmedUrl.replace(
      /\//g,
      '_'
    )}-${request.id}`;

    const oldDirectory = path.join(projectDirectoryPath, requestDirectoryPath);
    const oldDirectoryExists = await fs.pathExists(oldDirectory);

    if (oldDirectoryExists) {
      const newDirectory = path.join(projectDirectoryPath, request.id);
      await fs.move(oldDirectory, newDirectory);
    }
  }
}
