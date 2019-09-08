import path from 'path';
import fs from 'fs-extra';

import {
  getProjectDirectory,
  getRequestDirectory,
  getFileExtension,
} from '../../utils/path';
import { RequestRepository } from '../../domain/repository';
import { Request, Response } from '../../domain/entity';
import { MementoConfiguration } from '../../configuration';

interface Dependencies {
  config: MementoConfiguration;
}

export class RequestRepositoryFile implements RequestRepository {
  private config: MementoConfiguration;

  public constructor({ config }: Dependencies) {
    this.config = config;
  }

  public async getResponseByRequestId(requestId: string) {
    const request = await this.getRequestById(requestId);

    if (!request) {
      return null;
    }

    try {
      return this.buildResponseFromRequest(request);
    } catch (err) {
      return null;
    }
  }

  public async persistResponseForRequest(request: Request, response: Response) {
    await this.ensureRequestDirectory(request);
    await this.writeRequestMetaData(request, response);
    await this.writeResponseBody(request, response);
  }

  public async getAllRequests() {
    await this.ensureProjectDirectory();

    const subdirectories = await this.getSubdirectories();
    const allRequests: Request[] = [];

    for (const subdirectory of subdirectories) {
      const request = await this.buildRequestFromRequestDirectory(subdirectory);

      allRequests.push(request);
    }

    return allRequests;
  }

  public async getRequestById(requestId: string) {
    await this.ensureProjectDirectory();

    const requestDirectoryPath = await this.findRequestDirectoryByRequestId(
      requestId
    );

    return requestDirectoryPath
      ? this.buildRequestFromRequestDirectory(requestDirectoryPath)
      : null;
  }

  public async deleteAll() {
    await this.ensureProjectDirectory();

    const subdirectories = await this.getSubdirectories();

    for (const subdirectory of subdirectories) {
      await fs.remove(subdirectory);
    }
  }

  public async deleteByRequestId(requestId: string) {
    await this.ensureProjectDirectory();

    const requestDirectoryPath = await this.findRequestDirectoryByRequestId(
      requestId
    );

    if (requestDirectoryPath) {
      await fs.remove(requestDirectoryPath);
    }
  }

  private getProjectDirectoryPath() {
    return getProjectDirectory(
      this.config.cacheDirectory,
      this.config.targetUrl
    );
  }

  private async getSubdirectories() {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    const subdirectories = await fs.readdir(projectDirectoryPath);

    return subdirectories.map(subdirectory =>
      path.join(projectDirectoryPath, subdirectory)
    );
  }

  private ensureProjectDirectory() {
    return fs.ensureDir(this.getProjectDirectoryPath());
  }

  private ensureRequestDirectory(request: Request) {
    return fs.ensureDir(this.getRequestDirectoryPath(request));
  }

  private getRequestDirectoryPath(request: Request) {
    return getRequestDirectory(
      this.config.cacheDirectory,
      this.config.targetUrl,
      request
    );
  }

  private getRequestMetadataFilePath(request: Request) {
    return path.join(this.getRequestDirectoryPath(request), 'metadata.json');
  }

  private async getResponseBodyFilePath(request: Request) {
    const metadata = await this.getRequestMetaData(request);
    const contentType = metadata.responseHeaders['content-type'];
    const fileExtension = getFileExtension(contentType);

    return path.join(
      this.getRequestDirectoryPath(request),
      `body${fileExtension}`
    );
  }

  private getRequestMetaData(request: Request) {
    return fs.readJSON(this.getRequestMetadataFilePath(request));
  }

  private writeRequestMetaData(request: Request, response: Response) {
    return fs.outputJSON(this.getRequestMetadataFilePath(request), {
      method: request.method,
      url: request.url,
      requestBody: request.body,
      status: response.status,
      requestHeaders: request.headers,
      responseHeaders: response.headers,
      responseTime: response.responseTimeInMs,
    });
  }

  private async getResponseBody(request: Request) {
    const bodyFilePath = await this.getResponseBodyFilePath(request);

    return fs.readFile(bodyFilePath, 'utf-8');
  }

  private async writeResponseBody(request: Request, response: Response) {
    const bodyFilePath = await this.getResponseBodyFilePath(request);

    await fs.writeFile(bodyFilePath, response.body);
  }

  private async buildResponseFromRequest(request: Request) {
    const [metadata, body] = await Promise.all([
      this.getRequestMetaData(request),
      this.getResponseBody(request),
    ]);

    return new Response(
      parseInt(metadata.status, 10),
      metadata.responseHeaders,
      Buffer.from(body),
      metadata.responseTime || 0
    );
  }

  private async buildRequestFromRequestDirectory(directoryPath: string) {
    const metadata = await fs.readJSON(
      path.join(directoryPath, 'metadata.json')
    );

    return new Request(
      metadata.method,
      metadata.url,
      metadata.requestHeaders,
      metadata.requestBody
    );
  }

  private async findRequestDirectoryByRequestId(requestId: string) {
    const subdirectories = await this.getSubdirectories();

    for (const subdirectory of subdirectories) {
      const regexp = new RegExp(`${requestId}$`);

      if (regexp.test(subdirectory)) {
        return subdirectory;
      }
    }

    return null;
  }
}
