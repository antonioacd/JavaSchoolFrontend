import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import KeyIcon from '@mui/icons-material/Key';

export default function PasswordMeterInput({value, onChange}) {
  const minLength = 12;

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
    width: '100%', // Ajusta el ancho al 100% para que sea igual que un TextField de Angular
  };

  const passwordStrength = getPasswordStrength();
  const hue = Math.min(value.length * 10, 120);

  return (
    <Stack
      spacing={0.5}
      padding={0}
      sx={{
        '--hue': hue,
        '--progress-color': `hsl(${hue} 80% 40%)`,
        ...passwordMeterInputStyle // Nuevo color para la barra de progreso
      }}
    >
      <TextField
        type="password"
        placeholder=" Password"
        InputProps={{
          startAdornment: <KeyIcon />,
        }}
        value={value}
        onChange={onChange}
      />
      <LinearProgress
        variant="determinate"
        value={Math.min((value.length * 100) / minLength, 100)}
        sx={{
          bgcolor: 'background.level3',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--progress-color)', // Cambia el color de la barra de progreso
          },
        }}
      />

      <Typography
        variant="body-xs"
        sx={{ alignSelf: 'flex-end', color: `hsl(${hue} 80% 30%)` }}
      >
        {passwordStrength}
      </Typography>
    </Stack>
  );
}
