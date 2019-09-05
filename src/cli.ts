/* istanbul ignore file */

import Vorpal from 'vorpal';
import { AwilixContainer } from 'awilix';
import chalk from 'chalk';

import { ListRequest } from './domain/usecase';
import {
  CliClear,
  CliConfig,
  CliLs,
  CliRefresh,
  CliInfo,
  CliEdit,
  CliInjector,
} from './application/cli';

interface CreateCliOptions {
  container: AwilixContainer;
  reload: () => Promise<unknown>;
}

export function createCli({ container, reload }: CreateCliOptions) {
  const injector = new CliInjector(container);
  const requestsAutocomplete = {
    data() {
      return container
        .resolve<ListRequest>('listRequestsUseCase')
        .execute()
        .then(requests => requests.map(request => request.id));
    },
  };

  const vorpal = new Vorpal();

  vorpal.delimiter('memento$ ');

  vorpal
    .command('config', 'Displays the current configuration')
    .action(injector.action(CliConfig, 'print'));

  vorpal
    .command('config reload', 'Reloads the configuration file')
    .action(async function(this: Vorpal.CommandInstance) {
      await reload();

      const config = container.build(CliConfig, {
        injector: () => ({ logger: this.log.bind(this) }),
      });

      return config.print();
    });

  vorpal
    .command('ls', 'Lists all cached requests')
    .action(injector.action(CliLs, 'allRequests'));

  vorpal
    .command('clear all', 'Removes all cached responses')
    .action(injector.action(CliClear, 'all'));

  vorpal
    .command(
      'clear <requestId>',
      'Removes the cached response for the provided request id'
    )
    .autocomplete(requestsAutocomplete)
    .action(injector.action(CliClear, 'one'));

  vorpal
    .command(
      'refresh <requestId>',
      'Refetches the request and updates the response'
    )
    .autocomplete(requestsAutocomplete)
    .action(injector.action(CliRefresh, 'request'));

  vorpal
    .command(
      'info <requestId>',
      'Displays information about the request and its response'
    )
    .autocomplete(requestsAutocomplete)
    .option('-b, --body', 'Include the response body')
    .action(injector.action(CliInfo, 'request'));

  vorpal
    .command(
      'edit response-time <requestId> <responseTimeInMs>',
      'Sets the response time for the provided request id'
    )
    .action(injector.action(CliEdit, 'responseTime'));

  vorpal
    .command(
      'edit response-body <requestId>',
      'Opens your editor to edit the response body'
    )
    .action(injector.action(CliEdit, 'responseBody'));

  vorpal.log(chalk`{green 
      __   __  _______  __   __  _______  __    _  _______  _______ 
      |  |_|  ||       ||  |_|  ||       ||  |  | ||       ||       |
      |       ||    ___||       ||    ___||   |_| ||_     _||   _   |
      |       ||   |___ |       ||   |___ |       |  |   |  |  | |  |
      |       ||    ___||       ||    ___||  _    |  |   |  |  |_|  |
      | ||_|| ||   |___ | ||_|| ||   |___ | | |   |  |   |  |       |
      |_|   |_||_______||_|   |_||_______||_|  |__|  |___|  |_______|
    }
              `);

  container
    .build(CliConfig, {
      injector: () => ({ logger: vorpal.log.bind(vorpal) }),
    })
    .print();

  vorpal.log(chalk`Type {green help} to get available commands`);

  return vorpal;
}
