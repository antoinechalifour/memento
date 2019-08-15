import path from 'path';
import fs from 'fs-extra';

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
    await this.ensureCacheDirectory(request);

    try {
      const metadataFilePath = this.getMetaDataFilePath(request);
      const bodyFilePath = await this.getBodyFilePath(request);
      const [metadata, body] = await Promise.all([
        fs.readJSON(metadataFilePath),
        fs.readFile(bodyFilePath, 'utf-8'),
      ]);
      return new Response(
        parseInt(metadata.status, 10),
        metadata.responseHeaders,
        body
      );
    } catch (err) {
      return null;
    }
  }

  public async persistResponseForRequest(request: Request, response: Response) {
    await this.ensureCacheDirectory(request);

    // Write the metadata file
    const metadataFilePath = this.getMetaDataFilePath(request);
    await fs.outputJSON(metadataFilePath, {
      status: response.status,
      requestHeaders: request.headers,
      responseHeaders: response.headers,
    });

    // Write the content
    const bodyFilePath = await this.getBodyFilePath(request);
    await fs.writeFile(bodyFilePath, response.body);
  }

  private getCacheDirectoryPath(request: Request) {
    const projectDir = this.targetUrl
      .replace(/[:\/]/g, '_')
      .replace(/\./g, '-');
    const requestDir = `${request.method.toLowerCase()}_${request.url.replace(
      /\//g,
      '_'
    )}-${request.getComputedId()}`;
    return path.join(process.cwd(), '.memento-cache', projectDir, requestDir);
  }

  private getMetaDataFilePath(request: Request) {
    return path.join(this.getCacheDirectoryPath(request), 'metadata.json');
  }

  private async getBodyFilePath(request: Request) {
    const metadataFilePath = this.getMetaDataFilePath(request);
    const metadata = await fs.readJSON(metadataFilePath);
    const contentType = metadata.responseHeaders['content-type'];
    let fileExtension: string;

    if (this.isJson(contentType)) {
      fileExtension = 'json';
    } else if (this.isXml(contentType)) {
      fileExtension = 'xml';
    } else {
      fileExtension = 'txt';
    }

    return path.join(
      this.getCacheDirectoryPath(request),
      `body.${fileExtension}`
    );
  }

  private ensureCacheDirectory(request: Request) {
    const cacheDirPath = this.getCacheDirectoryPath(request);
    return fs.ensureDir(cacheDirPath);
  }

  private isJson(contentType: string | undefined) {
    return (
      contentType && contentType.toLowerCase().indexOf('application/json') >= 0
    );
  }

  private isXml(contentType: string | undefined) {
    if (!contentType) {
      return false;
    }
    const lowerCaseContentType = contentType.toLowerCase();

    return (
      lowerCaseContentType.indexOf('application/xml') >= 0 ||
      lowerCaseContentType.indexOf('text/xml') >= 0
    );
  }
}
