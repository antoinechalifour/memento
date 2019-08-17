/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { Memento } = require('../../../dist');
const { fetchPokemon } = require('./pokedex');

const memento = Memento({
  cacheDirectory: path.join(__dirname, '../memento-integration-tests-data'),
});

beforeAll(async () => {
  await memento.run();
});

afterAll(() => {
  memento.stop();
});

it('should return mewtwo information', async () => {
  // Given
  const pokemonId = 150;

  // When
  const pokemon = await fetchPokemon(pokemonId);

  //Then
  expect(pokemon.name).toEqual('mewtwo');
  expect(pokemon.id).toEqual(150);
});
