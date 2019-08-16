import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [beers, setBeers] = useState(null);

  useEffect(() => {
    window
      .fetch(`${API_URL}/beers`)
      .then(response => response.json())
      .then(setBeers);
  }, []);

  if (!beers) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {beers.map(beer => (
        <li key={beer.id}>{beer.name}</li>
      ))}
    </ul>
  );
}

export default App;
