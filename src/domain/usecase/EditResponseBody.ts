import path from 'path';
import childProcess from 'child_process';

import { getFileExtension, getRequestDirectory } from '../../utils/path';
import { RequestRepository } from '../repository';

interface Dependencies {
  cacheDirectory: string;
  targetUrl: string;
  requestRepository: RequestRepository;
}

export class EditResponseBody {
  private cacheDirectory: string;
  private targetUrl: string;
  private requestRepository: RequestRepository;

  public constructor({
    cacheDirectory,
    targetUrl,
    requestRepository,
  }: Dependencies) {
    this.cacheDirectory = cacheDirectory;
    this.targetUrl = targetUrl;
    this.requestRepository = requestRepository;
  }

  public async execute(requestId: string) {
    const request = await this.requestRepository.getRequestById(requestId);
    const response = await this.requestRepository.getResponseByRequestId(
      requestId
    );

    if (!request || !response) {
      throw new Error('Request not found');
    }
    const requestDirectoryPath = getRequestDirectory(
      this.cacheDirectory,
      this.targetUrl,
      request
    );

    const contentType = response.headers['content-type'];
    const fileExtension = getFileExtension(contentType);
    const bodyPath = path.join(requestDirectoryPath, `body${fileExtension}`);

    childProcess.spawnSync('vim', [bodyPath], {
      stdio: 'inherit',
    });
  }
}
