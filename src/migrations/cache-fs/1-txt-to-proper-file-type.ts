import path from 'path';
import fs from 'fs-extra';

import { Request } from '../../domain/entity';
import { RequestRepositoryFile } from '../../infrastructure/repository';
import { getFileExtension } from '../../utils/path';

export interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
}

function getRequestDirectoryName(request: Request) {
  const trimmedUrl = request.url.slice(0, 16);
  return `${request.method.toLowerCase()}_${trimmedUrl.replace(/\//g, '_')}-${
    request.id
  }`;
}

/**
 * Migrates for each cached request:
 *   body.txt -> to body.{appropriate file extension}
 */
export async function moveTxtToProperFileTypeMigration({
  targetUrl,
  cacheDirectory,
}: Dependencies) {
  const requestRepository = new RequestRepositoryFile({
    targetUrl,
    cacheDirectory,
  });
  const allRequests = await requestRepository.getAllRequests();

  const projectDirectoryName = targetUrl
    .replace(/[:\/]/g, '_')
    .replace(/\./g, '-');
  const projectFullPath = path.join(cacheDirectory, projectDirectoryName);

  for (const request of allRequests) {
    const requestDirectoryName = getRequestDirectoryName(request);
    const requestDirectory = path.join(projectFullPath, requestDirectoryName);

    // Read the metadata
    const metadatafile = await fs.readJson(
      path.join(requestDirectory, 'metadata.json')
    );

    // Infer the file extension based on the response content-type
    const contentType = metadatafile.responseHeaders['content-type'];
    const newFileExtension = getFileExtension(contentType);

    const oldBodyFile = path.join(requestDirectory, 'body.txt');
    const newBodyFile = path.join(requestDirectory, `body${newFileExtension}`);

    if (oldBodyFile !== newBodyFile) {
      const hasOldBodyFile = await fs.pathExists(oldBodyFile);

      // If the previous file existed, migrate it
      if (hasOldBodyFile) {
        await fs.move(oldBodyFile, newBodyFile);
      }
    }
  }
}
