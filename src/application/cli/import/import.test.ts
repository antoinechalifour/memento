import { readFile } from 'fs-extra';
import { defaultEditor } from 'env-editor';
import { spawnSync } from 'child_process';
import chalk from 'chalk';

import { ImportCurl } from '../../../domain/usecase';
import { getTestConfiguration } from '../../../test-utils/config';
import { MementoConfiguration } from '../../../configuration';
import { Logger } from '../types';
import { CliImport } from '.';
import { Request } from '../../../domain/entity';

jest.mock('child_process');
jest.mock('fs-extra');
jest.mock('env-editor');

const CACHE_DIRECTORY = 'some directory';
const TARGET_URL = 'some url';

function getTestDependencies(): {
  logger: Logger;
  importCurlUseCase: ImportCurl;
  config: MementoConfiguration;
} {
  return {
    logger: jest.fn(),
    // @ts-ignore
    importCurlUseCase: {
      execute: jest.fn().mockResolvedValue(null),
    },
    config: getTestConfiguration({
      cacheDirectory: CACHE_DIRECTORY,
      targetUrl: TARGET_URL,
    }),
  };
}

describe('import', () => {
  beforeEach(() => {
    // @ts-ignore
    (spawnSync as jest.Mock).mockReset();
    (readFile as jest.Mock).mockReset();
    (defaultEditor as jest.Mock).mockReturnValue({ binary: 'neovim' });
    (readFile as jest.Mock).mockResolvedValue('# Comment\ncurl command here');
  });

  it('should import the curl command', async () => {
    // Given
    const dependencies = getTestDependencies();
    const cliImport = new CliImport(dependencies);

    (dependencies.importCurlUseCase.execute as jest.Mock).mockResolvedValue(
      new Request('GET', '/', {}, '')
    );

    // When
    await cliImport.import();

    //Then
    expect(dependencies.importCurlUseCase.execute).toHaveBeenCalledTimes(1);
    expect(dependencies.importCurlUseCase.execute).toHaveBeenCalledWith(
      'curl command here'
    );
  });

  it('should use the user editor', async () => {
    // Given
    const dependencies = getTestDependencies();
    const cliImport = new CliImport(dependencies);

    (dependencies.importCurlUseCase.execute as jest.Mock).mockResolvedValue(
      new Request('GET', '/', {}, '')
    );

    // When
    await cliImport.import();

    //Then
    expect(spawnSync).toHaveBeenCalledTimes(1);
    expect(spawnSync).toHaveBeenCalledWith('neovim', [expect.any(String)], {
      stdio: 'inherit',
    });
  });

  it('should log an error message when an error is thrown', async () => {
    // Given
    const dependencies = getTestDependencies();
    const cliImport = new CliImport(dependencies);

    (dependencies.importCurlUseCase.execute as jest.Mock).mockRejectedValue(
      new Error('Something')
    );

    // When
    await cliImport.import();

    //Then
    expect(dependencies.logger).toHaveBeenCalledWith(
      chalk.red(
        'Invalid curl command provided. Please refer to the documentation for more instructions.'
      )
    );
  });
});
