import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ComboBoxTrains({ label, options, onSelect }) {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      sx={{ width: 222 }}
      getOptionLabel={(option) => option.trainNumber}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(event, value) => onSelect(value)}
    />
  );
}

export default ComboBoxTrains;
