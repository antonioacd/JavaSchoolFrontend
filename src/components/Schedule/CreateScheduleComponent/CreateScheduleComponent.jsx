import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleService from '../../../services/ScheduleService';
import 'react-datepicker/dist/react-datepicker.css';
import TrainService from '../../../services/TrainService';
import ComboBoxTrains from '../../Other/ComboBox/ComboBoxTrains';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import './CreateScheduleComponent.css';
import '../../SharedCSS.css';

// Enable dayjs duration plugin
dayjs.extend(duration);

/**
 * A component for creating a new schedule.
 */
function CreateScheduleComponent() {
  // State variables
  const [state, setState] = useState({
    departureTime: '',
    arrivalTime: '',
    occupiedSeats: 0,
    train: {
      id: 0,
      duration: '',
    },
  });

  const navigate = useNavigate();
  const [trainList, setTrainList] = useState([]);

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  /**
   * Fetch the list of trains when the component mounts.
   */
  useEffect(() => {
    TrainService.getTrains().then((res) => {
      const trains = res.data;
      setTrainList(trains);
    });
  }, []);

  /**
   * Calculate and update the arrival time when the selected train or departure time changes.
   */
  useEffect(() => {
    const originalDate = state.departureTime;
    const ISOduration = state.train.duration;

    const nuevaFecha = sumarDuracionAFecha(originalDate, ISOduration);

    setState({ ...state, arrivalTime: nuevaFecha });
  }, [state.train.duration, state.departureTime]);

  /**
   * Sum a duration to a given date.
   *
   * @param {string} originalDate - The original date in ISO format.
   * @param {string} ISOduration - The duration in ISO8601 format.
   * @returns {string} - The new date in ISO format.
   */
  function sumarDuracionAFecha(originalDate, ISOduration) {
    const fecha = dayjs(originalDate);
    const duracion = dayjs.duration(ISOduration);
    const nuevaFecha = fecha.add(duracion);

    return nuevaFecha.format('YYYY-MM-DDTHH:mm');
  }

  /**
   * Handle the change of departure time.
   *
   * @param {object} newDate - The new departure time as a Date object.
   */
  const changeDepartureTimeHandler = (newDate) => {
    const formattedDate = newDate.format('YYYY-MM-DDTHH:mm');
    setState({ ...state, departureTime: formattedDate });
  };

  /**
   * Handle the selection of a train.
   *
   * @param {object} selectedTrain - The selected train object.
   */
  const changeTrainHandler = (selectedTrain) => {
    if (selectedTrain === null) {
      return;
    }
    setState({ ...state, train: selectedTrain });
  };

  /**
   * Save the schedule and display success or error messages.
   *
   * @param {object} event - The click event.
   */
  const saveSchedule = (event) => {
    event.preventDefault();
    const error = checkState();

    if (error) {
      setDialogMessage('Error adding schedule. Please try again.');
      setErrorDialogOpen(true);
    } else {
      ScheduleService.createSchedule(state)
        .then(response => {
          if (response.status === 200) {
            setDialogMessage('Schedule added successfully');
            setSuccessDialogOpen(true);
          } else {
            setDialogMessage('Error adding schedule. Please try again.');
            setErrorDialogOpen(true);
          }
        })
        .catch(error => {
          setDialogMessage('Error adding schedule. Please try again.');
          setErrorDialogOpen(true);
        });
    }
  };

  /**
   * Check if the required fields are filled.
   *
   * @returns {string} - An error message if required fields are not filled, or an empty string if everything is filled.
   */
  function checkState() {
    if (
      state.train.id === '' ||
      state.departureTime === '' ||
      state.arrivalTime === ''
    ) {
      return 'Please fill in all fields.';
    }

    return '';
  }

  return (
    <div className="full-screen">
      <div className="container-custom">
        <div className="row justify-content-center">
          <h1 className="text-center">Create Schedule</h1>
        </div>

        <div className="row mt-4">
          <div className="col">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Departure time"
                value={dayjs(state.departureTime)}
                onChange={changeDepartureTimeHandler}
              />
            </LocalizationProvider>
          </div>

          <div className="col custom-selector">
            <ComboBoxTrains
              label="Train"
              options={trainList}
              onSelect={changeTrainHandler}
            />
          </div>
        </div>

        <div className="row mt-4 justify-content-between">
          <button type="button" className="btn btn-primary" onClick={saveSchedule}>
            Save schedule
          </button>
        </div>

        {/* Success and error dialog components */}
        <CustomizableDialog
          type="success"
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
          type="error"
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

export default CreateScheduleComponent;
