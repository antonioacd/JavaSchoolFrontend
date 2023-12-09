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
import scheduleService from '../../../services/ScheduleService';
import trainService from '../../../services/TrainService';
import EditIcon from '@mui/icons-material/Edit';
import utc from 'dayjs/plugin/utc';
import ticketService from '../../../services/TicketService';
import ViewTicketsComponent from '../../Ticket/ViewTicketsComponent/ViewTicketsComponent';

dayjs.extend(utc);
dayjs.extend(duration);

/**
 * A component for displaying and editing schedule details.
 */
function DetailScheduleComponent() {
    // Get the ID from the URL
    const { id } = useParams();

    const [state, setState] = useState({
        id: 0,
        departureTime: "",
        arrivalTime: "",
        occupiedSeats: 0,
        train: {
            id: 0,
            departureStation: {
                name: ""
            },
            arrivalStation: {
                name: ""
            },
            trainNumber: "",
            duration: "",
            seats: ""
        }
    });

    const [trainList, setTrainList] = useState([]);

    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [ticketList, setTicketList] = useState([]);

    /**
     * Fetch schedule details and available trains when the component mounts.
     */
    useEffect(() => {
        getSchedule();
        getTrains();
        getTickets();
    }, []);

    function getSchedule(){
        scheduleService.getScheduleById(id)
            .then((response) => {
                if (response.status === 200) {
                    const scheduleData = response.data;
                    setState(scheduleData);
                } else {
                    console.error("Error fetching schedule data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });
    }

    function getTrains(){
        trainService.getTrains()
            .then((response) => {
                if (response.status === 200) {
                    const trains = response.data;
                    setTrainList(trains);
                } else {
                    console.error("Error fetching trains data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching trains data:", error);
            });
            getTickets();
    }

    function getTickets(){
        ticketService.getTicketsByScheduleId(id)
            .then(response => {
              if (response.status === 200) {
                setTicketList(response.data)
              } else {
                setDialogMessage('Error getting tickets.');
                setErrorDialogOpen(true);
              }
            })
            .catch(error => {
              setDialogMessage('Error getting tickets.');
              setErrorDialogOpen(true);
            });
    }

    /**
     * Calculate and update the arrival time when the selected train or departure time changes.
     */
    useEffect(() => {
        const originalDate = state.departureTime;
        const ISOduration = state.train.duration;

        const nuevaFecha = sumarDuracionAFecha(originalDate, ISOduration);

        setState({ ...state, arrivalTime: nuevaFecha });
    }, [state.train.id, state.departureTime]);

    /**
     * Add a duration to a date.
     *
     * @param {string} originalDate - The original date in ISO format.
     * @param {string} ISOduration - The duration in ISO8601 format.
     * @returns {string} - The new date in ISO format.
     */
    function sumarDuracionAFecha(originalDate, ISOduration) {
        // Parse the original date in "YYYY-MM-DDTHH:mm" format
        const fecha = dayjs.utc(originalDate);

        // Parse the duration in ISO format
        const duracion = dayjs.duration(ISOduration);

        // Add the duration to the date
        const nuevaFecha = fecha.add(duracion);

        return nuevaFecha.format('YYYY-MM-DDTHH:mm');
    }

    /**
     * Handle the change of departure time.
     *
     * @param {object} newDate - The new departure time as a Date object.
     */
    const changeDepartureTimeHandler = (newDate) => {
        if (isEditable) {
            const formattedDate = newDate.format("YYYY-MM-DDTHH:mm");
            setState({ ...state, departureTime: formattedDate });
        }
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
     * Save the edited schedule and display success or error messages.
     *
     * @param {object} event - The click event.
     */
    const saveSchedule = (event) => {
        event.preventDefault();
        if (isEditable) {
            const error = checkState();

            if (error) {
                setDialogMessage('Error adding schedule. Please try again.');
                setErrorDialogOpen(true);
            } else {
                scheduleService.updateSchedule(state.id, state);
                setDialogMessage('Schedule updated successfully');
                setSuccessDialogOpen(true);
            }
        }
    };

    /**
     * Check if the required fields are filled.
     *
     * @returns {string} - An error message if required fields are not filled, or an empty string if everything is filled.
     */
    function checkState() {
        return "";
    }

    return (
        <div className="full-screen row">
            <div className='container-custom-big'>
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <h1 className="">Schedule Details</h1>
                    <IconButton
                        className="bg-primary"
                        onClick={() => setIsEditable(!isEditable)}
                    >
                        <EditIcon className='text-white'/> {/* Add edit icon here */}
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Departure time"
                                value={dayjs.utc(state.departureTime)}
                                onChange={changeDepartureTimeHandler}
                                disabled={!isEditable}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="col">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Arrival time"
                                value={dayjs.utc(state.arrivalTime)}
                                disabled={true}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className='col'>
                        <TextField
                            label="Occupied Seats"
                            variant="outlined"
                            value={state.occupiedSeats}
                            disabled={true}
                        />
                    </div>
                </div>
                {isEditable &&
                    <div className="row mt-4">
                        <div className="col custom-selector">
                            <ComboBoxTrains
                                label="Train"
                                options={trainList}
                                onSelect={changeTrainHandler}
                            />
                        </div>
                    </div>
                }
                <div className='row mt-4'>
                    <div className='col'>
                        <TextField
                            label="DepartureStation"
                            variant="outlined"
                            value={state.train.departureStation.name}
                            disabled={true}
                        />
                    </div>
                    <div className='col'>
                        <TextField
                            id='fullWitdh'
                            label="ArrivalStation"
                            variant="outlined"
                            value={state.train.arrivalStation.name}
                            disabled={true}
                        />
                    </div>
                    <div className='col'>
                        <TextField
                            label="Train Number"
                            variant="outlined"
                            value={state.train.trainNumber}
                            disabled={true}
                        />
                    </div>
                    <div className='col'>
                        <TextField
                            label="Seats"
                            variant="outlined"
                            value={state.train.seats}
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="row mt-4 justify-content-between">
                    {isEditable ? (
                        <button type="button" className="btn btn-primary" onClick={saveSchedule}>
                            Save schedule
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
            <div className='row'>
                <ViewTicketsComponent initialData={ticketList} isMainPage={false}/>
            </div>
            
        </div>
    );
}

export default DetailScheduleComponent;
