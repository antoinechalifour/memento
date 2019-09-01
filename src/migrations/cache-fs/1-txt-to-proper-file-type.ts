import path from 'path';
import fs from 'fs-extra';

import { RequestRepositoryFile } from '../../infrastructure/repository';
import { getFileExtension, getRequestDirectory } from '../../utils/path';

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

  for (const request of allRequests) {
    const requestDirectory = getRequestDirectory(
      cacheDirectory,
      targetUrl,
      request
    );
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
