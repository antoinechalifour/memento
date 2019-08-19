import { Request } from '../domain/entity';
import { getProjectDirectory, getRequestDirectory } from './path';

describe('getProjectDirectory', () => {
  it('should return the project directory', () => {
    // Given
    const cacheDirectory = '/tmp/.memento-cache';
    const targetUrl = 'https://pokeapi.co/api/v2';

    // When
    const projectDirectory = getProjectDirectory(cacheDirectory, targetUrl);

    //Then
    expect(projectDirectory).toEqual(
      '/tmp/.memento-cache/https___pokeapi-co_api_v2'
    );
  });
});

describe('getRequestDirectory', () => {
  it('should return the request directory', () => {
    // Given
    const cacheDirectory = '/tmp/.memento-cache';
    const targetUrl = 'https://pokeapi.co/api/v2';
    const request = new Request(
      'GET',
      '/really_long_url?with=some&query=parameters[get__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_urlget__really_long_url]',
      {},
      ''
    );

    // When
    const requestDirectory = getRequestDirectory(
      cacheDirectory,
      targetUrl,
      request
    );

    //Then
    expect(requestDirectory).toEqual(
      '/tmp/.memento-cache/https___pokeapi-co_api_v2/get__really_long_url-25276a6270cf8ba1277f7004a92dece9687f82e1'
    );
  });
});
