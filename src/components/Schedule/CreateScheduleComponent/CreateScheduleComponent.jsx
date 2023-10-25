import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleService from '../../../services/ScheduleService';
import Alert from 'react-bootstrap/Alert';
import 'react-datepicker/dist/react-datepicker.css';
import StationService from '../../../services/StationService';
import TrainService from '../../../services/TrainService';
import ComboBoxTrains from '../../Other/ComboBox/ComboBoxTrains';
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import './CreateScheduleComponent.css';

/**
 * Component for creating a schedule.
 */
function CreateScheduleComponent() {
    const [state, setState] = useState({
        "departureTime": "",
        "arrivalTime": "",
        "occupiedSeats": "0",
        "departureStation": {"id": 0,},
        "arrivalStation": {"id": 0,},
        "train": {"id": 0}
    });

    // Init the navigate variable
    const navigate = useNavigate();

    // Set the states of alerts
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [selectedDepartureDate, setSelectedDepartureDate] = useState(dayjs());
    const [selectedArrivalDate, setSelectedArrivalDate] = useState(dayjs());

    const [departureStationList, setDepartureStationList] = useState([]);
    const [arrivalStationList, setArrivalStationList] = useState([]);
    const [trainList, setTrainList] = useState([]);

    useEffect(() => {
        // Fetch the data and update departureStationList here
        StationService.getStations().then((res) => {
            const updatedDepartureStationList = res.data;
            setDepartureStationList(updatedDepartureStationList);
        });

    }, []);

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
     * Handle the change of arrival time.
     * @param {object} newDate - The new arrival time.
     */
    const changeArrivalTimeHandler = (newDate) => {
        const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        setSelectedArrivalDate(newDate);
        setState({ ...state, arrivalTime: formattedDate });
    };

    function getStations() {
        StationService.getStations().then((res) => {
          const updatedArrivalStationList = res.data;
          const filteredArrivalStationList = updatedArrivalStationList.filter(station => station.id !== state.departureStation.id);
          setArrivalStationList(filteredArrivalStationList);
        });
    }

    function getTrains(){
        // Fetch the data and update departureStationList here
        TrainService.getTrains().then((res) => {
            const trainListTmp = res.data;

            const updatedTrainList = [];

            trainListTmp.forEach(train => {
                console.log("Tren: ", train.currentStation.id + " - " + state.departureStation.id);
                if(train.currentStation.id === state.departureStation.id){
                    updatedTrainList.push(train);
                }
            });

            console.log("Updated", updatedTrainList);

            setTrainList(updatedTrainList);
        });
    }

    useEffect(() => {

        getStations();
        getTrains();
      
        console.log("Before", trainList);
      }, [state.departureStation]);

    /**
     * Handle the change of departure station.
     * @param {object} selectedDepartureStation - The selected departure station.
     */
    const changeDepartureStationHandler = (selectedDepartureStation) => {
        
        const train = {id: 0, seats: ""}

        changeTrainHandler(train);

        if (selectedDepartureStation === null) {
            return;
        }

        setState({...state,
            departureStation: { id: selectedDepartureStation.id }
        });

        console.log("Before", trainList);
    };

    /**
     * Handle the change of arrival station.
     * @param {object} selectedArrivalStation - The selected arrival station.
     */
    const changeArrivalStationHandler = (selectedArrivalStation) => {
        if (selectedArrivalStation === null) {
            return;
        }

        setState({ ...state, 
            arrivalStation: { id: selectedArrivalStation.id }
        });
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

        // Check if the fields are empty
        if (error) {
            setErrorMessage(error);
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
        } else {
            setShowSuccessAlert(true);
            setShowErrorAlert(false);

            // Call the save method
            ScheduleService.createSchedule(state)
            .then(response => {
                if (response.status === 200) {
                    setShowSuccessAlert(true);
                    setShowErrorAlert(false);
                } else {
                    setShowSuccessAlert(false);
                    setShowErrorAlert(true);
                }
            })
            .catch(error => {
                setShowSuccessAlert(false);
                setShowErrorAlert(true);
            });
        }
    };

    /**
     * Check the state for any errors.
     * @returns {string} - The error message, or an empty string if there are no errors.
     */
    function checkState() {
        
        if (state.departureStation.id === "" ||
            state.departureStation.name === "" ||
            state.departureStation.city === "" ||
            state.arrivalStation.id === "" ||
            state.arrivalStation.name === "" ||
            state.arrivalStation.city === "" ||
            state.train.id === "" ||
            state.train.seats === "" ||
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

            <div className="col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Arrival time"
                        value={dayjs(selectedArrivalDate)}
                        onChange={changeArrivalTimeHandler}
                    />
                </LocalizationProvider>
            </div>
            
          </div>
      
          <div className="row mt-4">
                <div className="col custom-selector">
                    <ComboBoxStations
                        label="Departure Station"
                        options={departureStationList} 
                        onSelect={changeDepartureStationHandler} />
                </div>
                <div className="col custom-selector">
                    <ComboBoxStations
                        label="Arrival Station"
                        options={arrivalStationList} 
                        onSelect={changeArrivalStationHandler} />
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
      
          <div className="alert-container mt-4">
            {showSuccessAlert && (
              <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="bottom-alert">
                Schedule added successfully.
              </Alert>
            )}

            {showErrorAlert && (
              <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible className="bottom-alert">
                {errorMessage || "Error adding schedule. Please try again."}
              </Alert>
            )}
          </div>
        </div>
      );
}

export default CreateScheduleComponent;
