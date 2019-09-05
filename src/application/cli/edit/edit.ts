import { SetResponseTime } from '../../../domain/usecase';
import { Logger } from '../types';
import { CliEdit } from '.';

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

describe('responseTime', () => {
  it('should set the response time for the provided request id', async () => {
    // Given
    const requestId = 'request-id';
    const responseTimeInMs = '666';
    const dependencies = getTestDependencies();
    const cliResponseTime = new CliEdit(dependencies);

    // When
    await cliResponseTime.responseTime({ requestId, responseTimeInMs });

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
