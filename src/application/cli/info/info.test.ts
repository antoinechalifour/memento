import { GetRequestDetails } from '../../../domain/usecase';
import { Request, Response } from '../../../domain/entity';
import { Logger } from '../types';
import { CliInfo } from '.';

function getTestDependencies(): {
  getRequestDetailsUseCase: GetRequestDetails;
  cacheDirectory: string;
  targetUrl: string;
  logger: Logger;
} {
  return {
    logger: jest.fn(),
    cacheDirectory: 'cache-directory',
    // @ts-ignore
    getRequestDetailsUseCase: {
      execute: jest.fn().mockResolvedValue([
        new Request(
          'get',
          '/',
          {
            accept: '*/*',
          },
          ''
        ),
        new Response(
          200,
          {
            'content-type': 'application/json',
          },
          Buffer.from(''),
          0
        ),
      ]),
    },
    targetUrl: 'target-url',
  };
}

describe('request', () => {
  it('should display the request info', async () => {
    // Given
    const requestId = 'request-id';
    const dependencies = getTestDependencies();
    const cliInfo = new CliInfo(dependencies);

    // When
    await cliInfo.request({
      requestId,
      options: {
        body: true,
      },
    });

    //Then
    expect(dependencies.getRequestDetailsUseCase.execute).toHaveBeenCalledTimes(
      1
    );
    expect(dependencies.getRequestDetailsUseCase.execute).toHaveBeenCalledWith(
      'request-id'
    );
  });
});
