import path from 'path';
import chalk from 'chalk';
import table from 'text-table';

import { GetRequestDetails } from '../../../domain/usecase';
import { getRequestDirectory } from '../../../utils/path';
import { MementoConfiguration } from '../../../configuration';
import { Logger } from '../types';

interface Dependencies {
  getRequestDetailsUseCase: GetRequestDetails;
  config: MementoConfiguration;
  logger: Logger;
}

export class CliInfo {
  private getRequestDetails: GetRequestDetails;
  private config: MementoConfiguration;
  private logger: Logger;

  public constructor({
    getRequestDetailsUseCase,
    config,
    logger,
  }: Dependencies) {
    this.getRequestDetails = getRequestDetailsUseCase;
    this.config = config;
    this.logger = logger;
  }

  public async request({
    requestId,
    options,
  }: {
    requestId: string;
    options: { body: boolean };
  }) {
    const [request, response] = await this.getRequestDetails.execute(requestId);

    const requestDirectoryPath = getRequestDirectory(
      this.config.cacheDirectory,
      this.config.targetUrl,
      request
    );

    this.logger(chalk`{green Request cache}`);
    this.logger(
      table([
        [chalk.yellow('Request directory'), chalk.white(requestDirectoryPath)],
        [
          chalk.yellow('Metadata file'),
          chalk.white(path.join(requestDirectoryPath, 'metadata.json')),
        ],
      ])
    );

    this.logger(chalk`\n\n{green Request information}`);
    this.logger(
      table([
        [chalk.yellow('Method'), chalk.white(request.method)],
        [chalk.yellow('URL'), chalk.white(request.url)],
        ...Object.keys(request.headers).map(headerName => [
          chalk.yellow(headerName),
          chalk.white(request.headers[headerName]),
        ]),
      ])
    );

    this.logger(chalk`\n\n{green Response information}`);
    this.logger(
      table([
        [
          chalk.yellow('Response Time'),
          chalk.white(response.responseTimeInMs.toString()),
        ],
        [chalk.yellow('Status code'), chalk.white(response.status.toString())],
        ...Object.keys(response.headers).map(headerName => [
          chalk.yellow(headerName),
          chalk.white(response.headers[headerName]),
        ]),
      ])
    );

    if (options.body) {
      this.logger(chalk`\n\n{green Response body}`);
      this.logger(response.body.toString('utf-8'));
    }
  }
}
