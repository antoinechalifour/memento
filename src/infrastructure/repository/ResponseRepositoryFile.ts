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
      method: request.method,
      url: request.url,
      requestBody: request.body,
      status: response.status,
      requestHeaders: request.headers,
      responseHeaders: response.headers,
    });

    // Write the content
    const bodyFilePath = await this.getBodyFilePath(request);
    await fs.writeFile(bodyFilePath, response.body);
  }

  public async getAllRequests() {
    await this.ensureProjectDirectory();

    const projectDirectoryPath = this.getProjectDirectoryPath();
    const subdirectories = await this.getSubdirectories();
    const allRequests: Request[] = [];

    for (const subdirectory of subdirectories) {
      const metadatFilePath = path.join(
        projectDirectoryPath,
        subdirectory,
        'metadata.json'
      );
      const metadata = await fs.readJSON(metadatFilePath);

      allRequests.push(
        new Request(
          metadata.method,
          metadata.url,
          metadata.requestHeaders,
          metadata.requestBody
        )
      );
    }

    return allRequests;
  }

  public async getRequestById(requestId: string) {
    await this.ensureProjectDirectory();

    const projectDirectoryPath = this.getProjectDirectoryPath();
    const subdirectories = await this.getSubdirectories();

    for (const subdirectory of subdirectories) {
      const regexp = new RegExp(`-${requestId}$`);

      if (regexp.test(subdirectory)) {
        const metadatFilePath = path.join(
          projectDirectoryPath,
          subdirectory,
          'metadata.json'
        );
        const metadata = await fs.readJSON(metadatFilePath);

        return new Request(
          metadata.method,
          metadata.url,
          metadata.requestHeaders,
          metadata.requestBody
        );
      }
    }

    return null;
  }

  public async deleteAll() {
    await this.ensureProjectDirectory();

    const projectDirectoryPath = this.getProjectDirectoryPath();
    const subdirectories = await this.getSubdirectories();

    for (const subdirectory of subdirectories) {
      await fs.remove(path.join(projectDirectoryPath, subdirectory));
    }
  }

  public async deleteByRequestId(requestId: string) {
    await this.ensureProjectDirectory();

    const projectDirectoryPath = this.getProjectDirectoryPath();
    const subdirectories = await this.getSubdirectories();

    for (const subdirectory of subdirectories) {
      const regexp = new RegExp(`-${requestId}$`);

      if (regexp.test(subdirectory)) {
        await fs.remove(path.join(projectDirectoryPath, subdirectory));
      }
    }
  }

  private getProjectDirectoryPath() {
    const projectDir = this.targetUrl
      .replace(/[:\/]/g, '_')
      .replace(/\./g, '-');

    return path.join(process.cwd(), '.memento-cache', projectDir);
  }

  private getCacheDirectoryPath(request: Request) {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    const requestDirectoryPath = `${request.method.toLowerCase()}_${request.url.replace(
      /\//g,
      '_'
    )}-${request.getComputedId()}`;
    return path.join(projectDirectoryPath, requestDirectoryPath);
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

  private getSubdirectories() {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    return fs.readdir(projectDirectoryPath);
  }

  private ensureProjectDirectory() {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    return fs.ensureDir(projectDirectoryPath);
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
