import chalk from 'chalk';

import { ClearAllRequests, ClearRequest } from '../../../domain/usecase';
import { Logger } from '../types';

interface Dependencies {
  logger: Logger;
  clearAllRequestsUseCase: ClearAllRequests;
  clearRequestUseCase: ClearRequest;
}

export class CliClear {
  private logger: Logger;
  private clearAllRequests: ClearAllRequests;
  private clearRequest: ClearRequest;

  public constructor({
    logger,
    clearAllRequestsUseCase,
    clearRequestUseCase,
  }: Dependencies) {
    this.logger = logger;
    this.clearAllRequests = clearAllRequestsUseCase;
    this.clearRequest = clearRequestUseCase;
  }

  public async all(): Promise<void> {
    this.logger('Clearing all cached responses...');
    await this.clearAllRequests.execute();
    this.logger('Done');
  }

  public async one({ requestId }: { requestId: string }): Promise<void> {
    this.logger(chalk`Clearing request {yellow ${requestId}}...`);
    await this.clearRequest.execute(requestId);
    this.logger('Done.');
  }
}
