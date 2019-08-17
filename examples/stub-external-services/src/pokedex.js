/* eslint-disable @typescript-eslint/no-var-requires */

const axios = require('axios');

function fetchPokemon(id) {
  return axios
    .get(`http://localhost:3344/pokemon/${id}`)
    .then(response => response.data);
}

module.exports = { fetchPokemon };
