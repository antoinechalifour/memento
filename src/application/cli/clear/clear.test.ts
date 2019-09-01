import { CliClear } from '.';
import { Logger } from '../types';
import { ClearAllRequests, ClearRequest } from 'domain/usecase';

function getTestDependencies(): {
  logger: Logger;
  clearAllRequestsUseCase: ClearAllRequests;
  clearRequestUseCase: ClearRequest;
} {
  return {
    logger: jest.fn(),
    // @ts-ignore
    clearAllRequestsUseCase: {
      execute: jest.fn().mockResolvedValue(null),
    },
    // @ts-ignore
    clearRequestUseCase: {
      execute: jest.fn().mockResolvedValue(null),
    },
  };
}

describe('all', () => {
  it('should clear all requests', async () => {
    // Given
    const dependencies = getTestDependencies();
    const cliClear = new CliClear(dependencies);

    // When
    await cliClear.all();

    //Then
    expect(dependencies.clearAllRequestsUseCase.execute).toHaveBeenCalledTimes(
      1
    );
  });
});

describe('one', () => {
  it('should clear the request', async () => {
    // Given
    const requestId = 'request-id';
    const dependencies = getTestDependencies();
    const cliClear = new CliClear(dependencies);

    // When
    await cliClear.one({ requestId });

    //Then
    expect(dependencies.clearRequestUseCase.execute).toHaveBeenCalledTimes(1);
    expect(dependencies.clearRequestUseCase.execute).toHaveBeenCalledWith(
      'request-id'
    );
  });
});
