import path from 'path';
import fs from 'fs-extra';

import { Request } from '../../domain/entity';
import { RequestRepositoryFile } from '../../infrastructure/repository';
import { getFileExtension } from '../../utils/path';
import { MementoConfiguration } from '../../configuration';

export interface Dependencies {
  config: MementoConfiguration;
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
  config,
}: Dependencies) {
  const requestRepository = new RequestRepositoryFile({ config });
  const allRequests = await requestRepository.getAllRequests();

  const projectDirectoryName = config.targetUrl
    .replace(/[:\/]/g, '_')
    .replace(/\./g, '-');
  const projectFullPath = path.join(
    config.cacheDirectory,
    projectDirectoryName
  );

  for (const request of allRequests) {
    const requestDirectoryName = getRequestDirectoryName(request);
    const requestDirectory = path.join(projectFullPath, requestDirectoryName);
    const requestDirectoryExists = await fs.pathExists(requestDirectory);

    if (!requestDirectoryExists) {
      continue;
    }

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
