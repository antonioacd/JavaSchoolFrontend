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

dayjs.extend(duration);

function CreateScheduleComponent() {
    const [state, setState] = useState({
        "departureTime": "",
        "arrivalTime": "",
        "occupiedSeats": 0,
        "train": { "id": 0 }
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
        let duration = "";

        const train = trainList.find(train => train.id === state.train.id);
        if (train) {
            duration = train.duration;
        }

        const fecha = state.departureTime;
        const fechaParseada = dayjs(fecha);
        const resultado = fechaParseada.add(dayjs.duration(duration));
        const resultadoFormateado = resultado.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        setState({ ...state, arrivalTime: resultadoFormateado });
    }, [state.train.id, state.departureTime]);

    const changeDepartureTimeHandler = (newDate) => {
        const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        setState({ ...state, departureTime: formattedDate });
    };

    const changeTrainHandler = (selectedTrain) => {
        if (selectedTrain === null) {
            return;
        }
        setState({ ...state, train: { id: selectedTrain.id } });
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

        if (dayjs().isBefore(dayjs())) {
            return "";
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
