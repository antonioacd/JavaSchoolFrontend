import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ComboBoxStations({ label, options, onSelect }) {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(event, value) => onSelect(value)}
    />
  );
}

export default ComboBoxStations;
