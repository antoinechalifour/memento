import path from 'path';
import fs from 'fs-extra';

import { RequestRepository } from '../../domain/repository';
import { getFileExtension, getRequestDirectory } from '../../utils/path';

export interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
  requestRepository: RequestRepository;
}

export async function moveTxtToProperFileTypeMigration({
  targetUrl,
  cacheDirectory,
  requestRepository,
}: Dependencies) {
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
