import { getTestRequestRepository } from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { ClearRequest } from './ClearRequest';

let useCase: ClearRequest;
let requestRepository: RequestRepository;

beforeEach(() => {
  requestRepository = getTestRequestRepository();

  useCase = new ClearRequest({ requestRepository });
});

it('should delete the request', async () => {
  // Given
  const requestId = 'request-id';

  // When
  await useCase.execute(requestId);

  //Then
  expect(requestRepository.deleteByRequestId).toHaveBeenCalledTimes(1);
  expect(requestRepository.deleteByRequestId).toHaveBeenCalledWith(requestId);
});
