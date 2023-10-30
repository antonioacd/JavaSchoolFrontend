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

dayjs.extend(duration);

function DetailScheduleComponent() {
    // Obtén el ID de la URL
    const { id } = useParams();

    const [state, setState] = useState({
        "id": 0,
        "departureTime": "",
        "arrivalTime": "",
        "occupiedSeats": 0,
        "train": {
            "id": 0,
            "departureStation": {
                "name": ""
            },
            "arrivalStation": {
                "name": ""
            },
            "trainNumber": "",
            "duration": "",
            "seats": ""
        }
    });

    const navigate = useNavigate();

    const [selectedDepartureDate, setSelectedDepartureDate] = useState(dayjs());
    const [selectedArrivalDate, setSelectedArrivalDate] = useState(dayjs());
    const [trainList, setTrainList] = useState([]);

    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isEditable, setIsEditable] = useState(false); // Nuevo estado para la edición

    useEffect(() => {
        scheduleService.getScheduleById(id)
            .then((response) => {
                if (response.status === 200) {
                    const scheduleData = response.data;
                    setState(scheduleData);
                    setSelectedDepartureDate(scheduleData.departureTime);
                    console.log(scheduleData);
                } else {
                    console.error("Error fetching schedule data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });

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
    }, []);

    useEffect(() => {
        let duration = state.train.duration;

        const fecha = state.departureTime;
        const fechaParseada = dayjs(fecha);
        const resultado = fechaParseada.add(dayjs.duration(duration));
        const resultadoFormateado = resultado.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        console.log("resultado", resultadoFormateado);

        setState({ ...state, arrivalTime: resultadoFormateado });
    }, [state.train.id, state.departureTime]);

    useEffect(() => {
        let duration = state.train.duration;

        const fecha = state.departureTime;
        const fechaParseada = dayjs(fecha);
        const resultado = fechaParseada.add(dayjs.duration(duration));
        const resultadoFormateado = resultado.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        console.log("resultado", resultadoFormateado);

        setState({ ...state, arrivalTime: resultadoFormateado });
    }, []);

    const changeDepartureTimeHandler = (newDate) => {
        if (isEditable) {
            const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
            setSelectedDepartureDate(newDate);
            setState({ ...state, departureTime: formattedDate });
        }
    };

    const changeTrainHandler = (selectedTrain) => {
        if (selectedTrain === null) {
            return;
        }

        setState({ ...state, train: selectedTrain });
    };

    const saveSchedule = (event) => {
        event.preventDefault();
        if (isEditable) {
            const error = checkState();

            if (error) {
                setDialogMessage('Error adding schedule. Please try again.');
                setErrorDialogOpen(true);
            } else {
                console.log("State", state);
                scheduleService.updateSchedule(state.id, state);
                setDialogMessage('Schedule updated successfully');
                setSuccessDialogOpen(true);
            }
        }
    };

    function checkState() {
        return "";
    }

    return (
        <div className="container border border-primary rounded p-3">
            

            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h1 className="">Schedule Details</h1>
                <IconButton
                  className="bg-primary"
                  onClick={() => setIsEditable(!isEditable)}
                >
                  <EditIcon className='text-white'/> {/* Agrega el ícono de lápiz aquí */}
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
                            value={dayjs(state.departureTime)}
                            onChange={changeDepartureTimeHandler}
                            disabled={!isEditable} // Deshabilitar cuando no es editable
                        />
                    </LocalizationProvider>
                </div>
                <div className="col">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Arrival time"
                            value={dayjs(state.arrivalTime)}
                            disabled={true} // Deshabilitar cuando no es editable
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
    );
}

export default DetailScheduleComponent;