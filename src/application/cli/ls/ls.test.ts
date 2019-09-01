import { ListRequest } from '../../../domain/usecase';
import { Request } from '../../../domain/entity';
import { Logger } from '../types';
import { CliLs } from '.';

function getTestDependencies(): {
  listRequestsUseCase: ListRequest;
  logger: Logger;
} {
  return {
    logger: jest.fn(),
    // @ts-ignore
    listRequestsUseCase: {
      execute: jest.fn().mockResolvedValue([]),
    },
  };
}

describe('allRequests', () => {
  it('should list all the requests', async () => {
    // Given
    const dependencies = getTestDependencies();
    (dependencies.listRequestsUseCase.execute as jest.Mock).mockResolvedValue([
      new Request('GET', '/', {}, ''),
    ]);
    const cliLs = new CliLs(dependencies);

    // When
    await cliLs.allRequests();

    //Then
    expect(dependencies.listRequestsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(dependencies.logger).not.toHaveBeenCalledWith(
      'No request have been cached for now.'
    );
  });

  it('should display a message if no request have been cached', async () => {
    // Given
    const dependencies = getTestDependencies();
    const cliLs = new CliLs(dependencies);

    // When
    await cliLs.allRequests();

    //Then
    expect(dependencies.listRequestsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(dependencies.logger).toHaveBeenCalledWith(
      'No request have been cached for now.'
    );
  });
});
