/* istanbul ignore file */

import Vorpal from 'vorpal';
import { AwilixContainer } from 'awilix';
import chalk from 'chalk';
import table from 'text-table';

import {
  ClearAllRequests,
  ClearRequest,
  RefreshRequest,
  ListRequest,
} from './domain/usecase';

interface CreateCliOptions {
  container: AwilixContainer;
}

export function createCli({ container }: CreateCliOptions) {
  const targetUrl = container.resolve<string>('targetUrl');
  const delay = container.resolve<number>('delay');
  const cacheDirectory = container.resolve<string>('cacheDirectory');
  const clearAllRequestsUseCase = container.resolve<ClearAllRequests>(
    'clearAllRequestsUseCase'
  );
  const clearRequestUseCase = container.resolve<ClearRequest>(
    'clearRequestUseCase'
  );
  const refreshRequestUseCase = container.resolve<RefreshRequest>(
    'refreshRequestUseCase'
  );
  const listRequestsUseCase = container.resolve<ListRequest>(
    'listRequestsUseCase'
  );

  const vorpal = new Vorpal();

  vorpal.delimiter('memento$ ');

  vorpal
    .command('ls', 'Lists all cached requests')
    .action(async function(this: Vorpal.CommandInstance) {
      const requests = await listRequestsUseCase.execute();

      if (requests.length === 0) {
        this.log('No request have been cached for now.');
        return;
      }

      this.log('The following requests have been cached:');
      this.log(
        table([
          [chalk.gray('id'), chalk.gray('method'), chalk.gray('url')],
          ...requests.map(request => [
            chalk.yellow(request.getComputedId()),
            chalk.green(request.method),
            chalk.white(request.url),
          ]),
        ])
      );
    });

  vorpal
    .command('clear all', 'Removes all cached responses')
    .action(async function(this: Vorpal.CommandInstance) {
      this.log('Clearing all cached responses...');
      await clearAllRequestsUseCase.execute();
      this.log('Done.');
    });

  vorpal
    .command(
      'clear <requestId>',
      'Removes the cached response for the provided request id'
    )
    .action(async function(this: Vorpal.CommandInstance, { requestId }) {
      this.log(chalk`Clearing request {yellow ${requestId}}...`);
      await clearRequestUseCase.execute(requestId);
      this.log('Done.');
    });

  vorpal
    .command(
      'refresh <requestId>',
      'Refetches the request and updates the response'
    )
    .action(async function(this: Vorpal.CommandInstance, { requestId }) {
      this.log(chalk`Refetching data for request {yellow ${requestId}}...`);
      await refreshRequestUseCase.execute(requestId);
      this.log('Done.');
    });

  console.log(chalk`{green 
      __   __  _______  __   __  _______  __    _  _______  _______ 
      |  |_|  ||       ||  |_|  ||       ||  |  | ||       ||       |
      |       ||    ___||       ||    ___||   |_| ||_     _||   _   |
      |       ||   |___ |       ||   |___ |       |  |   |  |  | |  |
      |       ||    ___||       ||    ___||  _    |  |   |  |  |_|  |
      | ||_|| ||   |___ | ||_|| ||   |___ | | |   |  |   |  |       |
      |_|   |_||_______||_|   |_||_______||_|  |__|  |___|  |_______|
    }
              `);
  console.log(chalk`Request will be forwarded to {yellow ${targetUrl}}`);
  console.log(chalk`Cache directory is set to {yellow ${cacheDirectory}}`);
  console.log(chalk`Applying a delay of {yellow ${delay.toString()}ms}`);
  console.log(chalk`Type {green help} to get available commands`);

  return vorpal;
}
