import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import trainService from '../../../../services/TrainService';
import CustomizableDialog from '../../CustomizableDialog/CustomizableDialog';
import ComboBoxTrains from '../../ComboBox/ComboBoxTrains';

/**
 * A dialog component for filtering schedules.
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
export default function ScheduleFilterDialogComponent({
  open = false,
  type = '',
  title = '',
  content = '',
  agreeButtonLabel = 'Agree',
  showCancelButton = true,
  cancelButtonLabel = 'Disagree',
  onAgree,
  onCancel,
}) {
  const [state, setState] = useState({
    trainNumber: '', // Corrected property name
  });

  const [trainList, setTrainList] = useState([]);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    getTrainList();
  }, [])

  /**
   * Fetches the list of trains and updates the state.
   */
  function getTrainList() {
    trainService
      .getTrains()
      .then((response) => {
        const trains = response.data;
        setTrainList(trains);
      })
      .catch((error) => {
        setDialogMessage(error);
        setErrorDialogOpen(true);
      });
  }

  /**
   * Handles the selection of a train in the ComboBox.
   *
   * @param {Object} selectedTrain - The selected train.
   */
  const changeTrainHandler = (selectedTrain) => {
    if (selectedTrain === null) {
      return;
    }

    setState({
      ...state,
      trainNumber: selectedTrain,
    });
  };

  /**
   * Handles the click event for the agree button.
   */
  const handleAgree = () => {
    if (onAgree) {
      onAgree(state.trainNumber, state.arrivalStation);
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
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-center">
          {getIcon()} {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="text-center">
            {content}
          </DialogContentText>
          <div className="row mt-2">
            <div className="col">
              <ComboBoxTrains
                label="Trains"
                options={trainList}
                onSelect={changeTrainHandler}
                value={state.trainNumber}
                disabled={false}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          {showCancelButton && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              {cancelButtonLabel}
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAgree}
            autoFocus
          >
            {agreeButtonLabel}
          </button>
        </DialogActions>
      </Dialog>
      <CustomizableDialog
        type="success"
        open={isSuccessDialogOpen}
        title="Success"
        content={dialogMessage}
        agreeButtonLabel="Accept"
        showCancelButton={false}
        onAgree={() => setSuccessDialogOpen(false)}
      />
      <CustomizableDialog
        type="error"
        open={isErrorDialogOpen}
        title="Error"
        content={dialogMessage}
        agreeButtonLabel="Accept"
        showCancelButton={false}
        onAgree={() => setErrorDialogOpen(false)}
      />
    </div>
  );
}
