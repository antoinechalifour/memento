import chalk from 'chalk';
import table from 'text-table';

import { ListRequest } from '../../../domain/usecase';
import { Logger } from '../types';

interface Dependencies {
  listRequestsUseCase: ListRequest;
  logger: Logger;
}

export class CliLs {
  private listRequests: ListRequest;
  private logger: Logger;

  public constructor({ listRequestsUseCase, logger }: Dependencies) {
    this.listRequests = listRequestsUseCase;
    this.logger = logger;
  }

  public async allRequests() {
    const requests = await this.listRequests.execute();

    if (requests.length === 0) {
      this.logger('No request have been cached for now.');
      return;
    }

    this.logger('The following requests have been cached:');
    this.logger(
      table([
        [chalk.gray('id'), chalk.gray('method'), chalk.gray('url')],
        ...requests.map(request => [
          chalk.yellow(request.id),
          chalk.green(request.method),
          chalk.white(request.url),
        ]),
      ])
    );
  }
}
