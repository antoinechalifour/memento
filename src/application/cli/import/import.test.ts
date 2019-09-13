import { readFile } from 'fs-extra';

import { ImportCurl } from '../../../domain/usecase';
import { getTestConfiguration } from '../../../test-utils/config';
import { MementoConfiguration } from '../../../configuration';
import { Logger } from '../types';
import { CliImport } from '.';
import { Request } from '../../../domain/entity';

jest.mock('child_process');
jest.mock('fs-extra');

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
});
