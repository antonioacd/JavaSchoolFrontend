import React, { useState } from 'react';
import ComboBoxTrains from '../ComboBox/ComboBoxTrains';

function AppTest() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieSelection = (movie) => {
    setSelectedMovie(movie);
  };

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    // Agrega más películas aquí
  ];

  return (
    <div>
      <h1>Seleccione una película:</h1>
      <ComboBoxTrains options={top100Films} onSelect={handleMovieSelection} />
      {selectedMovie && (
        <div>
          <h2>Película seleccionada:</h2>
          <p>{selectedMovie.label}</p>
        </div>
      )}
    </div>
  );
}

export default AppTest;
