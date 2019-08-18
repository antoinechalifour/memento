import { getTestRequestRepository } from '../../test-utils/infrastructure';
import { RequestRepository } from '../repository';
import { Request } from '../entity';
import { ListRequest } from './ListRequests';

let useCase: ListRequest;
let requestRepository: RequestRepository;

beforeEach(() => {
  requestRepository = getTestRequestRepository();
  useCase = new ListRequest({ requestRepository });
});

it('should return all the requests', async () => {
  // Given
  (requestRepository.getAllRequests as jest.Mock).mockResolvedValue([
    new Request(
      'put',
      '/pokemon/1',
      {
        authorization: 'Bearer token',
      },
      JSON.stringify({ name: 'Bulbasaur ' })
    ),
    new Request('get', '/pokemon/pikachu', {}, ''),
  ]);

  // When
  const requests = await useCase.execute();

  //Then
  expect(requests).toEqual([
    new Request(
      'put',
      '/pokemon/1',
      {
        authorization: 'Bearer token',
      },
      JSON.stringify({ name: 'Bulbasaur ' })
    ),
    new Request('get', '/pokemon/pikachu', {}, ''),
  ]);
});
