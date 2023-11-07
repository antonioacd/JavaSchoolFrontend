import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * A customizable dialog component that displays messages and options to the user.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {string} props.type - Type of the dialog ('success', 'warning', 'error').
 * @param {string} props.title - Title of the dialog.
 * @param {string} props.content - Content of the dialog.
 * @param {string} props.agreeButtonLabel - Label for the agree button.
 * @param {boolean} props.showCancelButton - Whether to show the cancel button.
 * @param {string} props.cancelButtonLabel - Label for the cancel button.
 * @param {Function} props.onAgree - Callback when the agree button is clicked.
 * @param {Function} props.onCancel - Callback when the cancel button is clicked.
 */
export default function CustomizableDialog({
  open = false,
  type = 'success',
  title = '',
  content = '',
  agreeButtonLabel = 'Agree',
  showCancelButton = true,
  cancelButtonLabel = 'Disagree',
  onAgree,
  onCancel,
}) {
  /**
   * Handles the click event for the agree button.
   */
  const handleAgree = () => {
    if (onAgree) {
      onAgree();
    }
  };

  /**
   * Handles the click event for the cancel button.
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Gets the corresponding icon based on the dialog type.
   *
   * @returns {JSX.Element} - The icon component.
   */
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
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
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
