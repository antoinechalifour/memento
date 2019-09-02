import chalk from 'chalk';

import { RefreshRequest } from '../../../domain/usecase';
import { Logger } from '../types';

interface Dependencies {
  refreshRequestUseCase: RefreshRequest;
  logger: Logger;
}

export class CliRefresh {
  private refreshRequest: RefreshRequest;
  private logger: Logger;

  public constructor({ refreshRequestUseCase, logger }: Dependencies) {
    this.refreshRequest = refreshRequestUseCase;
    this.logger = logger;
  }

  public async request({ requestId }: { requestId: string }) {
    this.logger(chalk`Refetching data for request {yellow ${requestId}}...`);
    await this.refreshRequest.execute(requestId);
    this.logger('Done.');
  }
}
