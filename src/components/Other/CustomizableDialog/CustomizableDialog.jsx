import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CustomizableDialog({
  open = false,
  type = 'success', // Agrega un parámetro 'type' para especificar el tipo de diálogo
  title = "Use Google's location service?",
  content = "Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.",
  agreeButtonLabel = 'Agree',
  showCancelButton = true,
  cancelButtonLabel = 'Disagree',
  onAgree,
  onCancel,
}) {
  const handleAgree = () => {
    if (onAgree) {
      onAgree();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Función para obtener el ícono en función del tipo
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {getIcon()} {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        {showCancelButton && (
          <button
          type='btn'
          className="btn btn-secondary"
            onClick={handleCancel}
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
          type='btn'
          className="btn btn-primary"
          onClick={handleAgree}
          autoFocus
        >
          {agreeButtonLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}
