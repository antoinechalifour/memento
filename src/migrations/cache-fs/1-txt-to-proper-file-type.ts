import path from 'path';
import fs from 'fs-extra';

import { RequestRepositoryFile } from '../../infrastructure/repository';
import { getFileExtension } from '../../utils/path';

export interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
}

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
    const trimmedUrl = request.url.slice(0, 16);
    const requestDirectoryPath = `${request.method.toLowerCase()}_${trimmedUrl.replace(
      /\//g,
      '_'
    )}-${request.id}`;

    const requestDirectory = path.join(projectFullPath, requestDirectoryPath);
    const metadatafile = await fs.readJson(
      path.join(requestDirectory, 'metadata.json')
    );

    const contentType = metadatafile.responseHeaders['content-type'];
    const newFileExtension = getFileExtension(contentType);

    const oldBodyFile = path.join(requestDirectory, 'body.txt');
    const newBodyFile = path.join(requestDirectory, `body${newFileExtension}`);

    if (oldBodyFile !== newBodyFile) {
      const hasOldBodyFile = await fs.pathExists(oldBodyFile);

      if (hasOldBodyFile) {
        await fs.move(oldBodyFile, newBodyFile);
      }
    }
  }
}
