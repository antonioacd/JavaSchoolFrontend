import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import KeyIcon from '@mui/icons-material/Key';
import validator from 'validator';

const PasswordMeterInput = ({ value, onChange, error, helperText }) => {
  const minLength = 8;

  const getPasswordStrength = () => {
    if (value.length < 3) {
      return 'Very weak';
    } else if (value.length >= 3 && value.length < 6) {
      return 'Weak';
    } else if (value.length >= 6 && value.length < 10) {
      return 'Strong';
    } else {
      return 'Very strong';
    }
  };

  const validatePassword = (password) => {
    if (validator.isEmpty(password)) {
      return 'Password is required';
    }

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      return 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character';
    }

    return '';
  };

  const [passwordErrors, setPasswordErrors] = useState('');
  const [hue, setHue] = useState(0);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    onChange(e);
    const error = validatePassword(password);
    setPasswordErrors(error);

    // Calcular el color de la barra lineal
    const newHue = Math.min(password.length * 10, 120);
    setHue(newHue);
  };

  return (
    <Stack spacing={0.5} padding={0} sx={{ '--hue': hue }}>
      <TextField
        type="password"
        placeholder=" Password"
        InputProps={{
          startAdornment: <KeyIcon />,
        }}
        value={value}
        onChange={handlePasswordChange}
        error={!!passwordErrors || error}
        helperText={passwordErrors || helperText}
      />
      <LinearProgress
        variant="determinate"
        value={Math.min((value.length * 100) / minLength, 100)}
        sx={{
          bgcolor: 'background.level3',
          '& .MuiLinearProgress-bar': {
            backgroundColor: `hsl(${hue} 80% 30%)`, // Usar el color calculado
          },
        }}
      />
      <Typography
        variant="body-xs"
        sx={{ alignSelf: 'flex-end', color: `hsl(${hue} 80% 30%)` }}
      >
        {getPasswordStrength()}
      </Typography>
    </Stack>
  );
};

export default PasswordMeterInput;
