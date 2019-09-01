import { CliResponseTime } from '.';
import { Logger } from '../types';
import { SetResponseTime } from 'domain/usecase';

function getTestDependencies(): {
  logger: Logger;
  setResponseTimeUseCase: SetResponseTime;
} {
  return {
    logger: jest.fn(),
    // @ts-ignore
    setResponseTimeUseCase: {
      execute: jest.fn().mockResolvedValue(null),
    },
  };
}

describe('set', () => {
  it('should set the response time for the provided request id', async () => {
    // Given
    const requestId = 'request-id';
    const responseTimeInMs = '666';
    const dependencies = getTestDependencies();
    const cliResponseTime = new CliResponseTime(dependencies);

    // When
    await cliResponseTime.set({ requestId, responseTimeInMs });

    //Then
    expect(dependencies.setResponseTimeUseCase.execute).toHaveBeenCalledTimes(
      1
    );
    expect(dependencies.setResponseTimeUseCase.execute).toBeCalledWith(
      'request-id',
      666
    );
  });
});
