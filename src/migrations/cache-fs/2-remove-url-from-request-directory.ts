import fs from 'fs-extra';
import path from 'path';

import { RequestRepository } from '../../domain/repository';
import { getProjectDirectory } from '../../utils/path';

export interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
  requestRepository: RequestRepository;
}

export async function moveRequestsToIdDirectories({
  targetUrl,
  cacheDirectory,
  requestRepository,
}: Dependencies) {
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
