import hashObject from 'object-hash';

import { Request } from './Request';

jest.mock('object-hash');

describe('getComputedId', () => {
  beforeEach(() => {
    ((hashObject as unknown) as jest.Mock).mockImplementation(object =>
      JSON.stringify(object)
    );
  });

  it('return a hash based on the request properties', () => {
    // Given
    const request = new Request(
      'GET',
      '/api/beers',
      { authorization: 'Bearer token' },
      'some json'
    );

    // When
    const id = request.getComputedId();

    //Then
    expect(id).toEqual(
      '{"method":"GET","url":"/api/beers","body":"some json","authorization":"Bearer token"}'
    );
  });
});
