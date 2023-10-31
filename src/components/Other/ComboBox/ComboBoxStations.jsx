import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ComboBoxStations({ label, options, onSelect, defaultValue, disabled }) {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      sx={{ width: 222 }}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(event, value) => onSelect(value)}
      value={defaultValue} 
      disabled={disabled}
    />
  );
}

export default ComboBoxStations;
