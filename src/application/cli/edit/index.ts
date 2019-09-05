import chalk from 'chalk';

import { SetResponseTime, EditResponseBody } from '../../../domain/usecase';
import { Logger } from '../types';

interface Dependencies {
  setResponseTimeUseCase: SetResponseTime;
  editResponseBodyUseCase: EditResponseBody;
  logger: Logger;
}

export class CliEdit {
  private setResponseTime: SetResponseTime;
  private editResponseBody: EditResponseBody;
  private logger: Logger;

  public constructor({
    setResponseTimeUseCase,
    editResponseBodyUseCase,
    logger,
  }: Dependencies) {
    this.setResponseTime = setResponseTimeUseCase;
    this.editResponseBody = editResponseBodyUseCase;
    this.logger = logger;
  }

  public async responseTime({
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

  public async responseBody({ requestId }: { requestId: string }) {
    try {
      await this.editResponseBody.execute(requestId);
    } catch (err) {
      console.log(err);
    }
  }
}
