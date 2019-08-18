import { getTestRequestRepository } from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { ClearAllRequests } from './ClearAllRequests';

let useCase: ClearAllRequests;
let requestRepository: RequestRepository;

beforeEach(() => {
  requestRepository = getTestRequestRepository();
  useCase = new ClearAllRequests({ requestRepository });
});

it('should clear all the requests', async () => {
  // When
  await useCase.execute();

  //Then
  expect(requestRepository.deleteAll).toHaveBeenCalledTimes(1);
});
