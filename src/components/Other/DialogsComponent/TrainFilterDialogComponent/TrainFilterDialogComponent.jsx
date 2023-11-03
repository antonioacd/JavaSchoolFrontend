import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ComboBoxStations from '../../ComboBox/ComboBoxStations';
import stationService from '../../../../services/StationService';
import CustomizableDialog from '../../CustomizableDialog/CustomizableDialog';

export default function TrainFilterDialogComponent({
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
    departureStation: {
      id: '',
    },
    arrivalStation: {
      id: '',
    },
  });

  const [departureStationList, setDepartureStationList] = useState([]);
  const [arrivalStationList, setArrivalStationList] = useState([]);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    getDepartureStationList();
  }, []);

  useEffect(() => {
    getArrivalStationList();
  }, [state.departureStation]);

  useEffect(() => {
    getDepartureStationList();
  }, [state.arrivalStation]);

  function getArrivalStationList() {
    stationService
      .getStations()
      .then((response) => {
        const stations = response.data;
        const departureStationId = state.departureStation.id;

        const filteredStationList = stations.filter(
          (station) => station.id !== departureStationId
        );

        setArrivalStationList(filteredStationList);
      })
      .catch((error) => {
        setDialogMessage(error);
        setErrorDialogOpen(true);
      });
  }

  function getDepartureStationList() {
    stationService
      .getStations()
      .then((response) => {
        const stations = response.data;
        const arrivalStationId = state.arrivalStation.id;

        const filteredStationList = stations.filter(
          (station) => station.id !== arrivalStationId
        );

        setDepartureStationList(filteredStationList);
      })
      .catch((error) => {
        setDialogMessage(error);
        setErrorDialogOpen(true);
      });
  }

  const changeDepartureStationHandler = (selectedDepartureStation) => {
    if (selectedDepartureStation === null) {
      return;
    }

    setState({
      ...state,
      departureStation: selectedDepartureStation,
    });
  };

  const changeArrivalStationHandler = (selectedArrivalStation) => {
    if (selectedArrivalStation === null) {
      return;
    }

    setState({
      ...state,
      arrivalStation: selectedArrivalStation,
    });
  };

  const handleAgree = () => {
    if (onAgree) {
      onAgree(state.departureStation, state.arrivalStation);
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
              <ComboBoxStations
                label="Departure Station"
                options={departureStationList}
                onSelect={changeDepartureStationHandler}
                value={state.departureStation}
                disabled={false}
              />
            </div>
            <div className="col">
              <ComboBoxStations
                label="Arrival Station"
                options={arrivalStationList}
                onSelect={changeArrivalStationHandler}
                value={state.arrivalStation}
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
