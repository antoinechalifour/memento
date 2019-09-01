import chalk from 'chalk';

import { SetResponseTime } from '../../../domain/usecase';
import { Logger } from '../types';

interface Dependencies {
  setResponseTimeUseCase: SetResponseTime;
  logger: Logger;
}

export class CliResponseTime {
  private setResponseTime: SetResponseTime;
  private logger: Logger;

  public constructor({ setResponseTimeUseCase, logger }: Dependencies) {
    this.setResponseTime = setResponseTimeUseCase;
    this.logger = logger;
  }

  public async set({
    requestId,
    responseTimeInMs,
  }: {
    requestId: string;
    responseTimeInMs: string;
  }) {
    this.logger(
      chalk`Setting response time to {yellow ${responseTimeInMs}ms} for request {yellow ${requestId}}...`
    );
    await this.setResponseTime.execute(
      requestId,
      parseInt(responseTimeInMs, 10)
    );
    this.logger('Done.');
  }
}
