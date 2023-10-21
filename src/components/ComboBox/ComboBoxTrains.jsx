import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ComboBoxTrains({ options, onSelect }) {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.seats}
      renderInput={(params) => <TextField {...params} label="Capacity" />}
      onChange={(event, value) => onSelect(value)}
    />
  );
}

export default ComboBoxTrains;
