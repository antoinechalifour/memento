import { getTestRequestRepository } from '../../test-utils/infrastructure';
import { getTestConfiguration } from '../../test-utils/config';
import { RequestRepository } from '../repository';
import { Response, Request } from '../entity';
import { ImportCurl } from './ImportCurl';

let targetUrl: string;
let useCase: ImportCurl;
let requestRepository: RequestRepository;

beforeEach(() => {
  targetUrl = 'https://pokeapi.co/api/v2';
  requestRepository = getTestRequestRepository();

  useCase = new ImportCurl({
    requestRepository,
    config: getTestConfiguration({ targetUrl }),
  });
});

it('should parse the curl command and save an empty response', async () => {
  // Given
  const curl =
    'curl --header "Content-Type: application/json" --request POST --data \'{"username":"xyz","password":"xyz"}\' https://pokeapi.co/api/v2/login';

  // When
  const result = await useCase.execute(curl);

  // Then
  expect(result).toEqual(
    new Request(
      'POST',
      '/login',
      {
        'content-type': 'application/json',
      },
      '{"username":"xyz","password":"xyz"}'
    )
  );

  expect(requestRepository.persistResponseForRequest).toHaveBeenCalledTimes(1);
  expect(requestRepository.persistResponseForRequest).toHaveBeenCalledWith(
    new Request(
      'POST',
      '/login',
      {
        'content-type': 'application/json',
      },
      '{"username":"xyz","password":"xyz"}'
    ),
    new Response(200, {}, Buffer.from(''), 0)
  );
});
