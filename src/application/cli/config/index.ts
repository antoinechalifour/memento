/* istanbul ignore file */

import chalk from 'chalk';
import table from 'text-table';

import { MementoConfiguration } from '../../../configuration';
import { Logger } from '../types';

interface Dependencies {
  config: MementoConfiguration;
  logger: Logger;
}

export class CliConfig {
  private config: MementoConfiguration;
  private logger: Logger;

  public constructor({ config, logger }: Dependencies) {
    this.config = config;
    this.logger = logger;
  }

  public print(): void {
    let disableCachingMessage = '';

    if (this.config.disableCachingPatterns.length) {
      disableCachingMessage += '\r';

      this.config.disableCachingPatterns.forEach(option => {
        disableCachingMessage += chalk`\t\t\t- {green ${option.method}} {yellow ${option.urlPattern}}\n`;
      });

      disableCachingMessage.trimEnd();
    } else {
      disableCachingMessage = chalk.gray('No request');
    }

    this.logger('Done');
    this.logger(
      table([
        [chalk.white('Memento Version'), chalk.yellow(this.config.version)],
        [chalk.white('Port'), chalk.yellow(this.config.port.toString())],
        [chalk.white('Target URL'), chalk.yellow(this.config.targetUrl)],
        [
          chalk.white('Use real response time'),
          chalk.yellow(this.config.useRealResponseTime.toString()),
        ],
        [
          chalk.white('Cache directory'),
          chalk.yellow(this.config.cacheDirectory),
        ],
        [
          chalk.white('Disabled cache for'),
          chalk.yellow(disableCachingMessage),
        ],
        [
          chalk.white('Ignore cookies pattern'),
          chalk.yellow(this.config.ignoreCookiesPattern.source),
        ],
      ])
    );
  }
}
