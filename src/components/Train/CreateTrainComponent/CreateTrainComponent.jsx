import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainService from '../../../services/TrainService';
import StationService from '../../../services/StationService';
import "./CreateTrainComponent.css";
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import { Duration } from "luxon";
import { TextField } from '@mui/material';
import SnackbarComponent from '../../Other/SnackbarComponent/SnackbarComponent'; // Import SnackbarComponent

function CreateTrainComponent() {
  const [state, setState] = useState({
    seats: '',
    departureStation: {
      id: ''
    },
    arrivalStation: {
      id: ''
    },
    duration: '',
    trainNumber: ''
  });

  const [updatedDuration, setUpdatedDuration] = useState('');

  const navigate = useNavigate();
  const [departureStationList, setDepartureStationList] = useState([]);
  const [arrivalStationList, setArrivalStationList] = useState([]);
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  useEffect(() => {
    StationService.getStations().then((res) => {
      const updatedDepartureStationList = res.data;
      setDepartureStationList(updatedDepartureStationList);
    });
  }, []);

  function getStations() {
    StationService.getStations().then((res) => {
      const updatedArrivalStationList = res.data;
      const filteredArrivalStationList = updatedArrivalStationList.filter(
        (station) => station.id !== state.departureStation.id
      );
      setArrivalStationList(filteredArrivalStationList);
    });
  }

  useEffect(() => {
    getStations();
  }, [state.departureStation]);

  const changeDepartureStationHandler = (selectedDepartureStation) => {
    if (selectedDepartureStation === null) {
      return;
    }

    setState({
      ...state,
      departureStation: { id: selectedDepartureStation.id },
    });
  };

  const changeArrivalStationHandler = (selectedArrivalStation) => {
    if (selectedArrivalStation === null) {
      return;
    }

    setState({
      ...state,
      arrivalStation: { id: selectedArrivalStation.id },
    });
  };

  const changeSeatsHandler = (event) => {
    setState({ ...state, seats: event.target.value });
  };

  const changeTrainNumberHandler = (event) => {
    setState({ ...state, trainNumber: event.target.value });
  };

  useEffect(() => {
    const formattedDuration = durationFormatter();
    setState({ ...state, duration: formattedDuration });
  }, [updatedDuration]);

  const changeDurationHandler = (event) => {
    const { value } = event.target;

    if (value === null) {
      return;
    }

    setUpdatedDuration(value);
  };

  function durationFormatter() {
    if (updatedDuration === '') {
      return '';
    }

    const minutes = parseInt(updatedDuration);
    const newDuration = Duration.fromObject({ minutes });
    return newDuration.toISO();
  }

  function cancel() {
    navigate("/");
  }

  const saveTrain = (event) => {
    event.preventDefault();
    // No se necesita actualizar el estado aquí

    // Check if the fields are empty
    if (checkState() === 1) {
      return;
    }

    console.log("State", state);

    TrainService.createTrain(state)
      .then((response) => {
        if (response.status === 200) {
          console.log('Train added successfully:', response.data);
          setSnackbarSeverity('success');
          setSnackbarMessage('Train added successfully');
          setSnackbarOpen(true);
        } else {
          console.error('Error adding train:', response.data);
          setSnackbarSeverity('error');
          setSnackbarMessage('Error adding train. Please try again.');
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error('Error adding train:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Error adding train. Please try again.');
        setSnackbarOpen(true);
      });
  }

  function checkState() {
    if (state.seats === "") {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please fill in all fields');
      setSnackbarOpen(true);
      return 1;
    }
    return 0;
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h1 className='text-center'>Create train</h1>
      </div>

      <div className="row mt-4 justify-content-center">
        <div className="col">
          <ComboBoxStations 
            options={departureStationList} 
            onSelect={changeDepartureStationHandler}
            label={"Departure Station"} />
        </div>
        <div className="col">
          <ComboBoxStations 
            options={arrivalStationList} 
            onSelect={changeArrivalStationHandler}
            label={"Arrival Station"} />
        </div>
      </div>
      <div className="row mt-4 justify-content-center">
        <div className="col">
          <TextField
            id="outlined-basic"
            label="Number of seats"
            variant="outlined"
            value={state.seats}
            onChange={changeSeatsHandler}
          />
        </div>
        <div className="col">
          <TextField
            id="outlined-basic"
            label="Duration in minutes"
            variant="outlined"
            value={updatedDuration}
            onChange={changeDurationHandler}
          />
        </div>
      </div>

      <div className="row mt-4 justify-content-center">
          <TextField
            id="outlined-basic"
            label="Train number"
            variant="outlined"
            value={state.trainNumber}
            onChange={changeTrainNumberHandler}
          />
      </div>

      <div className="row mt-4 justify-content-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveTrain}
        >
          Save train
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-2"
          onClick={cancel}
        >
          Cancel
        </button>
      </div>

      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );

}

export default CreateTrainComponent;
