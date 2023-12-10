import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import ComboBoxTrains from '../../Other/ComboBox/ComboBoxTrains';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import { IconButton, TextField } from '@mui/material';
import trainService from '../../../services/TrainService';
import EditIcon from '@mui/icons-material/Edit';
import { Duration } from "luxon";
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import stationService from '../../../services/StationService';
import validator from 'validator';

dayjs.extend(duration);

function DetailTrainComponent() {
  const { id } = useParams();

  const [state, setState] = useState({
    id: 0,
    departureStation: {
      id: "",
      name: "",
      city: ""
    },
    arrivalStation: {
      id: "",
      name: "",
      city: ""
    },
    trainNumber: "",
    duration: "",
    seats: ""
  });
  
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [departureStationList, setDepartureStationList] = useState([]);
  const [arrivalStationList, setArrivalStationList] = useState([]);
  const [savedState, setSavedState] = useState([]);
  const [parsedDuration, setParsedDuration] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    trainService.getTrainById(id)
      .then((response) => {
        if (response.status === 200) {
          const trainData = response.data;
          setState(trainData);
          setSavedState(trainData);
          setParsedDuration(durationToMinutes(trainData.duration));
        } else {
          console.error("Error fetching train data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching train data:", error);
      });
  }, [id]);

  useEffect(() => {
    getArrivalStationList();
  }, [state.departureStation]);

  useEffect(() => {
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

  function getAllStations() {
    stationService.getStations()
      .then((response) => {
        const stations = response.data;
        setDepartureStationList(stations);
        setArrivalStationList(stations);
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

    if (selectedDepartureStation.id !== state.arrivalStation.id) {
      setState({
        ...state,
        departureStation: selectedDepartureStation,
      });
    } else {
      setDialogMessage('You cannot select the same station as both departure and arrival.');
      setErrorDialogOpen(true);
    }
  };

  const changeArrivalStationHandler = (selectedArrivalStation) => {
    if (selectedArrivalStation === null) {
      return;
    }

    if (selectedArrivalStation.id !== state.departureStation.id) {
      setState({
        ...state,
        arrivalStation: selectedArrivalStation,
      });
    } else {
      setDialogMessage('You cannot select the same station as both departure and arrival.');
      setErrorDialogOpen(true);
    }
  };

  const saveTrain = (event) => {
    event.preventDefault();
    if (isEditable) {
      const error = checkState();

      if (error) {
        return;
      } else {
        trainService.updateTrain(state.id, state)
          .then((response) => {
            if (response.status === 200) {
              setDialogMessage('Train updated successfully');
              setSuccessDialogOpen(true);
            } else {
              setDialogMessage('Error updating train. Please try again.');
              setErrorDialogOpen(true);
            }
          })
          .catch((error) => {
            setDialogMessage(error.message);
            setErrorDialogOpen(true);
          });
      }
    }
  };

  const checkState = () => {
    const validationErrors = {
      departureStation: validator.isEmpty(String(state.departureStation?.id)) ? 'This field is required' : null,
      arrivalStation: validator.isEmpty(String(state.arrivalStation?.id)) ? 'This field is required' : null,
      trainNumber: validator.isEmpty(String(state.trainNumber)) ? 'This field is required' : null,
      seats: validator.isEmpty(String(state.seats)) ? 'This field is required' : null,
      duration: validator.isEmpty(String(state.duration)) ? 'This field is required' : null,
    };

    setErrors(validationErrors);

    return Object.values(validationErrors).some((error) => error !== null);
  };

  const changeSeatsHandler = (event) => {
    setState({ ...state, seats: event.target.value });
  };

  const changeTrainNumberHandler = (event) => {
    setState({ ...state, trainNumber: event.target.value });
  };

  const changeDurationHandler = (event) => {
    setState({ ...state, duration: minutesToDuration(event.target.value) });
    setParsedDuration(event.target.value);
  };

  function durationToMinutes(durationISO) {
    if (!durationISO) {
      return;
    }

    const duration = Duration.fromISO(durationISO);
    return duration.as('minutes');
  }

  function minutesToDuration(timeInMinutes) {
    if (!timeInMinutes) {
      return;
    }

    const minutes = parseInt(timeInMinutes);
    const newDuration = Duration.fromObject({ minutes });
    return newDuration.toISO();
  }

  const handleEditButton = () => {
    setIsEditable(!isEditable);

    if (isEditable) {
      setState(savedState);
    }
  };

  return (
    <div className="full-screen">
      <div className='container-custom-mid'>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h1>Train Details</h1>
          <IconButton
            className="bg-primary"
            onClick={handleEditButton}
          >
            <EditIcon className='text-white'/>
          </IconButton>
        </div>

        <div className="row mt-4">
          <div className='col'>
            <TextField
              label="Id"
              variant="outlined"
              value={state.id}
              disabled={true}
            />
          </div>
          <div className="col">
            <ComboBoxStations
              options={departureStationList}
              onSelect={changeDepartureStationHandler}
              label={"Departure Station"}
              disabled={!isEditable}
              defaultValue={state.departureStation}
              error={errors.departureStation}
            />
          </div>
          <div className="col">
            <ComboBoxStations
              options={arrivalStationList}
              onSelect={changeArrivalStationHandler}
              label={"Arrival Station"}
              defaultValue={state.arrivalStation}
              disabled={!isEditable}
              error={errors.arrivalStation}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col'>
            <TextField
              label="Train Number"
              variant="outlined"
              value={state.trainNumber}
              disabled={!isEditable}
              onChange={changeTrainNumberHandler}
              error={errors.trainNumber}
              helperText={errors.trainNumber}
            />
          </div>
          <div className='col'>
            <TextField
              label="Seats"
              variant="outlined"
              type='number'
              value={state.seats}
              disabled={!isEditable}
              onChange={changeSeatsHandler}
              error={errors.seats}
              helperText={errors.seats}
            />
          </div>
          <div className='col'>
            <TextField
              label="Duration in minutes"
              variant="outlined"
              type='number'
              value={parsedDuration}
              disabled={!isEditable}
              onChange={changeDurationHandler}
              error={errors.duration}
              helperText={errors.duration}
            />
          </div>
        </div>

        <div className="row mt-4 justify-content-between">
          {isEditable ? (
            <button type="button" className="btn btn-primary" onClick={saveTrain}>
              Save train
            </button>
          ) : null}
        </div>

        <CustomizableDialog
          type='success'
          open={isSuccessDialogOpen}
          title="Success"
          content={dialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => {
            setSuccessDialogOpen(false);
            window.location.reload();
          }}
        />
        <CustomizableDialog
          type='error'
          open={isErrorDialogOpen}
          title="Error"
          content={dialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => setErrorDialogOpen(false)}
        />
      </div>
    </div>
  );
}

export default DetailTrainComponent;
