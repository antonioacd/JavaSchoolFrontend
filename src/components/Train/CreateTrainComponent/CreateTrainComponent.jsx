import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainService from '../../../services/TrainService';
import StationService from '../../../services/StationService';
import "./CreateTrainComponent.css";
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import { Duration } from "luxon";
import { TextField } from '@mui/material';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog'; // Import CustomizableDialog

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
    const error = checkState();

    if (error) {
      setDialogMessage('Error adding train. Please try again.');
      setErrorDialogOpen(true);
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
    if (state.seats === "") {
      return "Please fill in all fields.";
    }

    return "";
  }

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/");
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
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
          onClick={()=>window.location.reload()}
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
  );

}

export default CreateTrainComponent;
