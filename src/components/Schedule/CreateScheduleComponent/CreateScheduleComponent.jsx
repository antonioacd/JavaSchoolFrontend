import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleService from '../../../services/ScheduleService';
import SnackbarComponent from '../../Other/SnackbarComponent/SnackbarComponent'; // Import SnackbarComponent
import 'react-datepicker/dist/react-datepicker.css';
import StationService from '../../../services/StationService';
import TrainService from '../../../services/TrainService';
import ComboBoxTrains from '../../Other/ComboBox/ComboBoxTrains';
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import './CreateScheduleComponent.css';

dayjs.extend(duration);

/**
 * Component for creating a schedule.
 */
function CreateScheduleComponent() {
    const [state, setState] = useState({
        "departureTime": "",
        "arrivalTime": "",
        "occupiedSeats": "0",
        "train": {"id": 0}
    });

    // Init the navigate variable
    const navigate = useNavigate();
    
    const [selectedDepartureDate, setSelectedDepartureDate] = useState(dayjs());
    const [selectedArrivalDate, setSelectedArrivalDate] = useState(dayjs());
    const [trainList, setTrainList] = useState([]);
    
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');

    useEffect(() => {
        // Fetch the data and update departureStationList here
        TrainService.getTrains().then((res) => {
            const trains = res.data;
            setTrainList(trains);
        });
    }, []);

    useEffect(() => {
        // Fetch the data and update departureStationList here
        let duration = "";
        
        const train = trainList.find(train => train.id === state.train.id);
        if (train) {
            duration = train.duration;
        }
    
        // Fecha en formato ISO 8601
        const fecha = state.departureTime;
    
        // Parsea la fecha
        const fechaParseada = dayjs(fecha);
    
        // Parsea la duración y súmala a la fecha
        const resultado = fechaParseada.add(dayjs.duration(duration));
    
        // Formatea el resultado con el offset de tiempo
        const resultadoFormateado = resultado.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    
        setState({ ...state, arrivalTime: resultadoFormateado })
    
    }, [state.train.id]);

    /**
     * Handle the change of departure time.
     * @param {object} newDate - The new departure time.
     */
    const changeDepartureTimeHandler = (newDate) => {
        const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        setSelectedDepartureDate(newDate);
        setState({ ...state, departureTime: formattedDate });
    };

    /**
     * Handle the change of the selected train.
     * @param {object} selectedTrain - The selected train.
     */
    const changeTrainHandler = (selectedTrain) => {
        if (selectedTrain === null) {
            console.log("Train", selectedTrain);
            return;
        }

        setState({ ...state, train: {id: selectedTrain.id} });
    };

    /**
     * Navigate to the home page.
     */
    const cancel = () => {
        navigate("/");
    };

    /**
     * Save the schedule in the database.
     * @param {object} event - The event object.
     */
    const saveSchedule = (event) => {
        event.preventDefault();
        const error = checkState();

        console.log("State",state);

        // Check if the fields are empty
        if (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(error);
            setSnackbarOpen(true);
        } else {
            ScheduleService.createSchedule(state)
            .then(response => {
                if (response.status === 200) {
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Schedule added successfully');
                    setSnackbarOpen(true);
                } else {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Error adding schedule. Please try again.');
                    setSnackbarOpen(true);
                }
            })
            .catch(error => {
                setSnackbarSeverity('error');
                setSnackbarMessage('Error adding schedule. Please try again.');
                setSnackbarOpen(true);
            });
        }
    };

    /**
     * Check the state for any errors.
     * @returns {string} - The error message, or an empty string if there are no errors.
     */
    function checkState() {
        if (state.train.id === "" ||
            state.departureTime === "" ||
            state.arrivalTime === "") {
            return "Please fill in all fields.";
        }

        if (dayjs().isBefore(dayjs())) {
            return "";
        }

        if (selectedArrivalDate.isBefore(selectedDepartureDate)) {
            return "The arrival time cannot be before the departure time.";
        }

        return "";
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <h1 className="text-center">Create Schedule</h1>
            </div>
      
            <div className="row mt-4">
                <div className="col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Departure time"
                        value={dayjs(selectedDepartureDate)}
                        onChange={changeDepartureTimeHandler}
                    />
              </LocalizationProvider>
              </div>
            </div>
      
          <div className="row mt-4">
            <div className="col custom-selector">
              <ComboBoxTrains
                label="Train"
                options={trainList} 
                onSelect={changeTrainHandler} />
            </div>
          </div>
      
          <div className="row mt-4 justify-content-between">
            <button type="button" className="btn btn-primary" onClick={saveSchedule}>
              Save schedule
            </button>
            <button type="button" className="btn btn-secondary mt-2" onClick={cancel}>
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

export default CreateScheduleComponent;
