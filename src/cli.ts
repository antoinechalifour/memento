/* istanbul ignore file */

import Vorpal from 'vorpal';
import path from 'path';
import { AwilixContainer } from 'awilix';
import chalk from 'chalk';
import table from 'text-table';

import {
  ClearAllRequests,
  ClearRequest,
  RefreshRequest,
  ListRequest,
  GetRequestDetails,
} from './domain/usecase';
import { getRequestDirectory } from './utils/path';

interface CreateCliOptions {
  container: AwilixContainer;
}

export function createCli({ container }: CreateCliOptions) {
  const targetUrl = container.resolve<string>('targetUrl');
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
  const getRequestDetailsUseCase = container.resolve<GetRequestDetails>(
    'getRequestDetailsUseCase'
  );
  const appVersion = container.resolve<string>('appVersion');

  const requestsAutocomplete = {
    data() {
      return listRequestsUseCase
        .execute()
        .then(requests => requests.map(request => request.id));
    },
  };

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
            chalk.yellow(request.id),
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
    .autocomplete(requestsAutocomplete)
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
    .autocomplete(requestsAutocomplete)
    .action(async function(this: Vorpal.CommandInstance, { requestId }) {
      this.log(chalk`Refetching data for request {yellow ${requestId}}...`);
      await refreshRequestUseCase.execute(requestId);
      this.log('Done.');
    });

  vorpal
    .command(
      'info <requestId>',
      'Displays information about the request and its response'
    )
    .autocomplete(requestsAutocomplete)
    .option('-b, --body', 'Include the response body')
    .action(async function(
      this: Vorpal.CommandInstance,
      { requestId, options }
    ) {
      const [request, response] = await getRequestDetailsUseCase.execute(
        requestId
      );

      const requestDirectoryPath = getRequestDirectory(
        cacheDirectory,
        targetUrl,
        request
      );

      this.log(chalk`{green Request cache}`);
      this.log(
        table([
          [
            chalk.yellow('Request directory'),
            chalk.white(requestDirectoryPath),
          ],
          [
            chalk.yellow('Metadata file'),
            chalk.white(path.join(requestDirectoryPath, 'metadata.json')),
          ],
        ])
      );

      this.log(chalk`\n\n{green Request information}`);
      this.log(
        table([
          [chalk.yellow('Method'), chalk.white(request.method)],
          [chalk.yellow('URL'), chalk.white(request.url)],
          ...Object.keys(request.headers).map(headerName => [
            chalk.yellow(headerName),
            chalk.white(request.headers[headerName]),
          ]),
        ])
      );

      this.log(chalk`\n\n{green Response information}`);
      this.log(
        table([
          [
            chalk.yellow('Response Time'),
            chalk.white(response.responseTimeInMs.toString()),
          ],
          [
            chalk.yellow('Status code'),
            chalk.white(response.status.toString()),
          ],
          ...Object.keys(response.headers).map(headerName => [
            chalk.yellow(headerName),
            chalk.white(response.headers[headerName]),
          ]),
        ])
      );

      if (options.body) {
        this.log(chalk`\n\n{green Response body}`);
        this.log(response.body);
      }
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
  console.log(chalk`Using Memento {yellow ${appVersion}}`);
  console.log(chalk`Request will be forwarded to {yellow ${targetUrl}}`);
  console.log(chalk`Cache directory is set to {yellow ${cacheDirectory}}`);
  console.log(chalk`Type {green help} to get available commands`);

  return vorpal;
}
