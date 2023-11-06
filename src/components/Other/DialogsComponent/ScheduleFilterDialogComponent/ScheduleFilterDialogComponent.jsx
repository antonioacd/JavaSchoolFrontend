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

export default function ScheduleFilterDialogComponent({
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
  const [state, setState] = useState({
    train: {
      id: '',
    },
  });

  const [trainList, setTrainList] = useState([]);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    getTrainList();
    console.log("trains:", trainList);
  }, [])

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

  const changeTrainHandler = (selectedTrain) => {
    if (selectedTrain === null) {
      return;
    }

    setState({
      ...state,
      trainNumber: selectedTrain,
    });
  };

  const handleAgree = () => {
    if (onAgree) {
      onAgree(state.trainNumber, state.arrivalStation);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

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
