/* istanbul ignore file */

import chalk from 'chalk';
import table from 'text-table';

import { DisableCachePattern } from '../../../domain/entity';
import { Logger } from '../types';

interface Dependencies {
  appVersion: string;
  port: number;
  targetUrl: string;
  cacheDirectory: string;
  useRealResponseTime: boolean;
  disableCachingPatterns: DisableCachePattern[];
  logger: Logger;
}

export class CliConfig {
  private appVersion: string;
  private cacheDirectory: string;
  private disableCachingPatterns: DisableCachePattern[];
  private port: number;
  private targetUrl: string;
  private useRealResponseTime: boolean;
  private logger: Logger;

  public constructor({
    appVersion,
    cacheDirectory,
    disableCachingPatterns,
    port,
    targetUrl,
    useRealResponseTime,
    logger,
  }: Dependencies) {
    this.appVersion = appVersion;
    this.cacheDirectory = cacheDirectory;
    this.disableCachingPatterns = disableCachingPatterns;
    this.port = port;
    this.targetUrl = targetUrl;
    this.useRealResponseTime = useRealResponseTime;
    this.logger = logger;
  }

  public print(): void {
    let disableCachingMessage = '';

    if (this.disableCachingPatterns.length) {
      disableCachingMessage += '\r';

      this.disableCachingPatterns.forEach(option => {
        disableCachingMessage += chalk`\t\t\t- {green ${option.method}} {yellow ${option.urlPattern}}\n`;
      });

      disableCachingMessage.trimEnd();
    } else {
      disableCachingMessage = chalk.gray('No request');
    }

    this.logger('Done');
    this.logger(
      table([
        [chalk.white('Memento Version'), chalk.yellow(this.appVersion)],
        [chalk.white('Port'), chalk.yellow(this.port.toString())],
        [chalk.white('Target URL'), chalk.yellow(this.targetUrl)],
        [
          chalk.white('Use real response time'),
          chalk.yellow(this.useRealResponseTime.toString()),
        ],
        [chalk.white('Cache directory'), chalk.yellow(this.cacheDirectory)],
        [
          chalk.white('Disabled cache for'),
          chalk.yellow(disableCachingMessage),
        ],
      ])
    );
  }
}
