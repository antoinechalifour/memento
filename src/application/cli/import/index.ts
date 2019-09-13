import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import { writeFile, readFile } from 'fs-extra';
import chalk from 'chalk';

import { ImportCurl } from '../../../domain/usecase';
import { getRequestDirectory } from '../../../utils/path';
import { MementoConfiguration } from '../../../configuration';
import { Logger } from '../types';

const EDITOR_OUPUT_FILE = `${tmpdir}/memento-editor`;

interface Dependencies {
  config: MementoConfiguration;
  importCurlUseCase: ImportCurl;
  logger: Logger;
}

export class CliImport {
  private config: MementoConfiguration;
  private importCurl: ImportCurl;
  private logger: Logger;

  public constructor({ config, importCurlUseCase, logger }: Dependencies) {
    this.config = config;
    this.importCurl = importCurlUseCase;
    this.logger = logger;
  }

  public async import() {
    // Reset the file content
    await writeFile(
      EDITOR_OUPUT_FILE,
      '# Paste your curl commmand on the next line\n'
    );

    // Get the command using the user editor
    spawnSync('nano', [EDITOR_OUPUT_FILE], {
      stdio: 'inherit',
    });

    const editorContents = await readFile(EDITOR_OUPUT_FILE, 'utf-8');
    const command = editorContents.split('\n')[1];

    const request = await this.importCurl.execute(command);

    const requestDirectory = getRequestDirectory(
      this.config.cacheDirectory,
      this.config.targetUrl,
      request
    );

    this.logger(chalk`Request {yellow ${request.id}} has been created.`);
    this.logger(
      chalk`You may edit the request information at {yellow ${requestDirectory}}`
    );
  }
}
