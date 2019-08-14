import path from 'path';
import { promises as fs } from 'fs';

import { logger } from '../../util/logger';
import { ResponseRepository } from '../../domain/repository';
import { Request, Response } from '../../domain/entity';

interface Dependencies {
  targetUrl: string;
}

export class ResponseRepositoryFile implements ResponseRepository {
  private targetUrl: string;

  public constructor({ targetUrl }: Dependencies) {
    this.targetUrl = targetUrl;
  }

  public async getResponseForRequest(request: Request) {
    const filePath = this.getFilePath(request);
    logger.debug(`Trying to read file ${filePath}`);

    try {
      const contents = await fs.readFile(filePath, 'utf-8');
      const [rawStatus, rawHeaders, body] = contents.split('\n\n');

      return new Response(
        parseInt(rawStatus, 10),
        JSON.parse(rawHeaders),
        body
      );
    } catch (err) {
      return null;
    }
  }

  public async persistResponseForRequest(request: Request, response: Response) {
    const filePath = this.getFilePath(request);
    const contents = [
      response.status,
      JSON.stringify(response.headers),
      response.body,
    ].join('\n\n');

    logger.debug(`Persisting response for ${filePath}`);
    try {
      await fs.mkdir(this.getPersistanceDirectory());
    } catch (err) {
      // Ignore
    }

    await fs.writeFile(filePath, contents, 'utf-8');
  }

  private getFileName(request: Request) {
    const sanitizedUrl = request.url.replace(/\//, '_');
    return `${request.method}-${sanitizedUrl}-${request.getComputedId()}`;
  }

  private getFilePath(request: Request) {
    return path.join(this.getPersistanceDirectory(), this.getFileName(request));
  }

  private getPersistanceDirectory() {
    const hashedUrl = Buffer.from(this.targetUrl).toString('base64');
    const fileName = `.memento-cache-${hashedUrl}`;

    return path.join(process.cwd(), fileName);
  }
}
