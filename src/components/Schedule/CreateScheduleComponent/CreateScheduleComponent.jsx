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
import { format } from 'date-fns';
dayjs.extend(duration);

function CreateScheduleComponent() {
    const [state, setState] = useState({
        "departureTime": "",
        "arrivalTime": "",
        "occupiedSeats": 0,
        "train": { 
            "id": 0,
            "duration": ""    
        }
    });

    const navigate = useNavigate();
    const [trainList, setTrainList] = useState([]);

    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        TrainService.getTrains().then((res) => {
            const trains = res.data;
            setTrainList(trains);
        });
    }, []);

    useEffect(() => {
        const originalDate = state.departureTime;
        const ISOduration = state.train.duration;

        console.log("fecha original: " + originalDate + " ISOduration: " + ISOduration);

        const nuevaFecha = sumarDuracionAFecha(originalDate, ISOduration);

        console.log("sumada" + nuevaFecha);

        setState({ ...state, arrivalTime: nuevaFecha });
    }, [state.train.duration, state.departureTime]);

    function sumarDuracionAFecha(originalDate, ISOduration) {
        // Parsea la fecha original en formato "YYYY-MM-DDTHH:mm"
        const fecha = dayjs(originalDate);
      
        // Parsea la duración en formato ISO
        const duracion = dayjs.duration(ISOduration);
      
        // Suma la duración a la fecha
        const nuevaFecha = fecha.add(duracion);
      
        return nuevaFecha.format('YYYY-MM-DDTHH:mm');
    }

    const changeDepartureTimeHandler = (newDate) => {
        const formattedDate = newDate.format("YYYY-MM-DDTHH:mm");
        console.log("Fecha departure: ", formattedDate);

        setState({ ...state, departureTime: formattedDate });
    };

    const changeTrainHandler = (selectedTrain) => {
        if (selectedTrain === null) {
            return;
        }
        setState({ ...state, train: selectedTrain });
    };

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

    function checkState() {
        if (state.train.id === "" ||
            state.departureTime === "" ||
            state.arrivalTime === "") {
            return "Please fill in all fields.";
        }

        return "";
    }

    return (
        <div className="full-screen">
            <div className='container-custom'>
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
                </div>

                <div className="row mt-4">
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

export default CreateScheduleComponent;
