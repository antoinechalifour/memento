import path from 'path';
import fs from 'fs-extra';

import { RequestRepository } from '../../domain/repository';
import { Request, Response } from '../../domain/entity';

interface Dependencies {
  targetUrl: string;
  cacheDirectory: string;
}

function isJson(contentType: string | undefined) {
  return (
    contentType && contentType.toLowerCase().indexOf('application/json') >= 0
  );
}

function isXml(contentType: string | undefined) {
  if (!contentType) {
    return false;
  }

  const lowerCaseContentType = contentType.toLowerCase();

  return (
    lowerCaseContentType.indexOf('application/xml') >= 0 ||
    lowerCaseContentType.indexOf('text/xml') >= 0
  );
}

export class RequestRepositoryFile implements RequestRepository {
  private targetUrl: string;
  private cacheDirectory: string;

  public constructor({ targetUrl, cacheDirectory }: Dependencies) {
    this.targetUrl = targetUrl;
    this.cacheDirectory = cacheDirectory;
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
    const projectDir = this.targetUrl
      .replace(/[:\/]/g, '_')
      .replace(/\./g, '-');

    return path.join(this.cacheDirectory, projectDir);
  }

  private async getSubdirectories() {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    const subdirectories = await fs.readdir(projectDirectoryPath);

    return subdirectories.map(subdirectory =>
      path.join(projectDirectoryPath, subdirectory)
    );
  }

  private ensureProjectDirectory() {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    return fs.ensureDir(projectDirectoryPath);
  }

  private ensureRequestDirectory(request: Request) {
    const cacheDirPath = this.getRequestDirectoryPath(request);
    return fs.ensureDir(cacheDirPath);
  }

  private getRequestDirectoryPath(request: Request) {
    const projectDirectoryPath = this.getProjectDirectoryPath();
    const requestDirectoryPath = `${request.method.toLowerCase()}_${request.url.replace(
      /\//g,
      '_'
    )}-${request.id}`;

    return path.join(projectDirectoryPath, requestDirectoryPath);
  }

  private getRequestMetadataFilePath(request: Request) {
    return path.join(this.getRequestDirectoryPath(request), 'metadata.json');
  }

  private async getResponseBodyFilePath(request: Request) {
    const metadata = await this.getRequestMetaData(request);
    const contentType = metadata.responseHeaders['content-type'];
    let fileExtension: string;

    if (isJson(contentType)) {
      fileExtension = 'json';
    } else if (isXml(contentType)) {
      fileExtension = 'xml';
    } else {
      fileExtension = 'txt';
    }

    return path.join(
      this.getRequestDirectoryPath(request),
      `body.${fileExtension}`
    );
  }

  private getRequestMetaData(request: Request) {
    const metadataFilePath = this.getRequestMetadataFilePath(request);

    return fs.readJSON(metadataFilePath);
  }

  private writeRequestMetaData(request: Request, response: Response) {
    const metadataFilePath = this.getRequestMetadataFilePath(request);

    return fs.outputJSON(metadataFilePath, {
      method: request.method,
      url: request.url,
      requestBody: request.body,
      status: response.status,
      requestHeaders: request.headers,
      responseHeaders: response.headers,
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
    const metadata = await this.getRequestMetaData(request);
    const body = await this.getResponseBody(request);

    return new Response(
      parseInt(metadata.status, 10),
      metadata.responseHeaders,
      body
    );
  }

  private async buildRequestFromRequestDirectory(directoryPath: string) {
    const metadatFilePath = path.join(directoryPath, 'metadata.json');
    const metadata = await fs.readJSON(metadatFilePath);

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
      const regexp = new RegExp(`-${requestId}$`);

      if (regexp.test(subdirectory)) {
        return subdirectory;
      }
    }

    return null;
  }
}
