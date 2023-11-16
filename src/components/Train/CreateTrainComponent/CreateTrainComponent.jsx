// CreateTrainComponent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import TrainService from '../../../services/TrainService';
import stationService from '../../../services/StationService';
import "./CreateTrainComponent.css";
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import { Duration } from "luxon";
import { TextField } from '@mui/material';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import '../../SharedCSS.css';

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

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Obtiene las de salida");
    getDepartureStationList();
  }, []);

  useEffect(() => {
    console.log("Obtiene las de llegada");
    getArrivalStationList();
  }, [state.departureStation]);

  useEffect(() => {
    console.log("Obtiene las de salida");
    getDepartureStationList();
  }, [state.arrivalStation]);

  function getArrivalStationList() {
    stationService.getStations()
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
    stationService.getStations()
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
    if (!selectedDepartureStation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        departureStation: true,
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      departureStation: false,
    }));

    setState({
      ...state,
      departureStation: selectedDepartureStation,
    });
  };

  const changeArrivalStationHandler = (selectedArrivalStation) => {
    if (!selectedArrivalStation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        arrivalStation: true,
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      arrivalStation: false,
    }));

    setState({
      ...state,
      arrivalStation: selectedArrivalStation,
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
    const errors = checkState();

    if (errors) {
      return;
    } else {
      TrainService.createTrain(state)
        .then(response => {
          if (response.status === 200) {
            setDialogMessage('Train added successfully');
            setSuccessDialogOpen(true);
          } else {
            setDialogMessage('Error adding train. Please try again.');
            setErrorDialogOpen(true);
          }
        })
        .catch(error => {
          setDialogMessage('Error adding train. Please try again.');
          setErrorDialogOpen(true);
        });
    }
  }

  function checkState() {
    const validationErrors = {
      seats: validator.isEmpty(String(state.seats)) ? 'This field is required' : null,
      duration: validator.isEmpty(String(state.duration)) ? 'This field is required' : null,
      departureStation: validator.isEmpty(String(state.departureStation?.id)) ? 'This field is required' : null,
      arrivalStation: validator.isEmpty(String(state.arrivalStation?.id)) ? 'This field is required' : null,
      trainNumber: validator.isEmpty(String(state.trainNumber)) ? 'This field is required' : null,
    };
  
    setErrors(validationErrors);
  
    return Object.values(validationErrors).some((error) => error !== null);
  }

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    window.location.reload();
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  return (
    <div className="full-screen">
      <div className='container-custom'>
        <div className="row justify-content-center">
          <h1 className='text-center'>Create train</h1>
        </div>

        <div className="row mt-4 justify-content-center">
          <div className="col">
            <ComboBoxStations
              options={departureStationList}
              onSelect={changeDepartureStationHandler}
              label={"Departure Station"}
              error={errors.departureStation}
            />
          </div>
          <div className="col">
            <ComboBoxStations
              options={arrivalStationList}
              onSelect={changeArrivalStationHandler}
              label={"Arrival Station"}
              error={errors.arrivalStation}
            />
          </div>
        </div>
        <div className="row mt-4 justify-content-center">
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Number of seats"
              type='number'
              variant="outlined"
              value={state.seats}
              onChange={changeSeatsHandler}
              error={errors.seats}
              helperText={errors.seats}
            />
          </div>
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Duration in minutes"
              type='number'
              variant="outlined"
              value={updatedDuration}
              onChange={changeDurationHandler}
              error={errors.duration}
              helperText={errors.duration}
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
            error={errors.trainNumber}
            helperText={errors.trainNumber}
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
            onClick={() => window.location.reload()}
          >
            Clear
          </button>
        </div>

        <CustomizableDialog
          type='success'
          open={isSuccessDialogOpen}
          title="Success"
          content={dialogMessage}
          agreeButtonLabel="Accept"
          showCancelButton={false}
          onAgree={handleSuccessDialogClose}
        />

        <CustomizableDialog
          type='error'
          open={isErrorDialogOpen}
          title="Error"
          content={dialogMessage}
          agreeButtonLabel="Accept"
          showCancelButton={false}
          onAgree={handleErrorDialogClose}
        />
      </div>
    </div>
  );
}

export default CreateTrainComponent;
