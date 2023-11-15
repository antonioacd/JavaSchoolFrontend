import React, { useState, useEffect } from 'react';
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

  const passwordMeterInputStyle = {
    width: '100%',
  };

  const hue = Math.min(value.length * 10, 120);

  const validatePassword = (password) => {
    if (validator.isEmpty(password)) {
      console.log("error vacio");
      return 'Password is required';
    }

    if (password.length < minLength) {
      console.log("error longitud");
      return `Password must be at least ${minLength} characters long`;
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      console.log("error cosas");
      return 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character';
    }

    console.log("error ninguno");
    return '';
  };

  const [passwordErrors, setPasswordErrors] = useState('');

  useEffect(() => {
    // Actualizar passwordErrors cada vez que cambie el valor
    const error = validatePassword(value);
    setPasswordErrors(error);
  }, [value]);

  return (
    <Stack
      spacing={0.5}
      padding={0}
      sx={{
        '--hue': hue,
        '--progress-color': `hsl(${hue} 80% 40%)`,
        ...passwordMeterInputStyle,
      }}
    >
      <TextField
        type="password"
        placeholder=" Password"
        InputProps={{
          startAdornment: <KeyIcon />,
        }}
        value={value}
        onChange={(e) => {
          const password = e.target.value;
          onChange(e);
          // Actualizar el estado con los errores de contraseña
          const error = validatePassword(password);
          setPasswordErrors(error);
        }}
        error={!!passwordErrors}
        helperText={passwordErrors || helperText}
      />
      <LinearProgress
        variant="determinate"
        value={Math.min((value.length * 100) / minLength, 100)}
        sx={{
          bgcolor: 'background.level3',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--progress-color)',
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
