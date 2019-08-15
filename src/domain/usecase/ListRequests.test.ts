import { ResponseRepository } from '../repository';
import { Request } from '../entity';
import { ListRequest } from './ListRequest';

let useCase: ListRequest;
let responseRepository: ResponseRepository;

beforeEach(() => {
  responseRepository = {
    getResponseForRequest: jest.fn().mockResolvedValue(null),
    persistResponseForRequest: jest.fn().mockResolvedValue(null),
    getAllRequests: jest.fn().mockResolvedValue([]),
    deleteAll: jest.fn().mockResolvedValue(null),
    deleteByRequestId: jest.fn().mockResolvedValue(null),
    getRequestById: jest.fn().mockResolvedValue(null),
  };
  useCase = new ListRequest({ responseRepository });
});

it('should return all the requests', async () => {
  // Given
  (responseRepository.getAllRequests as jest.Mock).mockResolvedValue([
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
