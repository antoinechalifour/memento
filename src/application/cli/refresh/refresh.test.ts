import { RefreshRequest } from '../../../domain/usecase';
import { Logger } from '../types';
import { CliRefresh } from '.';

function getTestDependencies(): {
  refreshRequestUseCase: RefreshRequest;
  logger: Logger;
} {
  return {
    logger: jest.fn(),
    // @ts-ignore
    refreshRequestUseCase: {
      execute: jest.fn().mockResolvedValue(null),
    },
  };
}

describe('request', () => {
  it('should refresh the request', async () => {
    // Given
    const requestId = 'request-id';
    const dependencies = getTestDependencies();
    const cliRefresh = new CliRefresh(dependencies);

    // When
    await cliRefresh.request({ requestId });

    //Then
    expect(dependencies.refreshRequestUseCase.execute).toHaveBeenCalledTimes(1);
    expect(dependencies.refreshRequestUseCase.execute).toHaveBeenCalledWith(
      'request-id'
    );
  });
});
