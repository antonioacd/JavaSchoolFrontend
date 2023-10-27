import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StationService from '../../../services/StationService';
import TextField from '@mui/material/TextField';
import SnackbarComponent from '../../Other/SnackbarComponent/SnackbarComponent';
import './CreateStationComponent.css';

function CreateStationComponent() {
  const [state, setState] = useState({
    name: '',
    city: ''
  });

  const navigate = useNavigate();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const changeNameHandler = (event) => {
    setState({ ...state, name: event.target.value });
  };

  const changeCityHandler = (event) => {
    setState({ ...state, city: event.target.value });
  };

  const cancel = () => {
    navigate('/');
  };

  const saveStation = (event) => {
    event.preventDefault();

    const stationData = {
      name: state.name,
      city: state.city
    };

    if (checkState() === 1) {
      return;
    }

    StationService.createStation(stationData)
      .then(response => {
        if (response.status === 200) {
          setSnackbarSeverity('success');
          setSnackbarMessage('Station added successfully');
          setShowSuccessAlert(true);
          setShowErrorAlert(false);
        } else {
          setSnackbarSeverity('error');
          setSnackbarMessage('Error adding station. Please try again.');
          setShowSuccessAlert(false);
          setShowErrorAlert(true);
        }
      })
      .catch(error => {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error adding station. Please try again.');
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
      });
  };

  function checkState() {
    if (state.name === '' || state.city === '') {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please fill in all fields');
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
      return 1;
    }
    return 0;
  }

  const handleSnackbarClose = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h1 className='text-center'>Create station</h1>
      </div>

      <div className="card-body">
        <div className="row mt-4 justify-content-center">
          <div className="col">
            <TextField
              label="Station Name"
              variant="outlined"
              value={state.name}
              onChange={changeNameHandler}
              style={{ width: '100%' }}
            />
          </div>
          <div className="col">
            <TextField
              label="Station City"
              variant="outlined"
              value={state.city}
              onChange={changeCityHandler}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="row mt-4 justify-content-center">
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={saveStation}
          >
            Save station
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </div>

      <SnackbarComponent
        open={showSuccessAlert || showErrorAlert}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
}

export default CreateStationComponent;
