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

dayjs.extend(duration);

function DetailTrainComponent() {
    // Obtén el ID de la URL
    const { id } = useParams();

    const [state, setState] = useState({
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
    });

    const navigate = useNavigate();

    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isEditable, setIsEditable] = useState(false); // Nuevo estado para la edición

    useEffect(() => {
        trainService.getTrainById(id)
            .then((response) => {
                if (response.status === 200) {
                    const trainData = response.data;
                    setState(trainData);
                    console.log(trainData);
                } else {
                    console.error("Error fetching train data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching train data:", error);
            });
    }, []);

    const saveTrain = (event) => {
        event.preventDefault();
        if (isEditable) {
            const error = checkState();

            if (error) {
                setDialogMessage('Error adding train. Please try again.');
                setErrorDialogOpen(true);
            } else {
                console.log("State", state);
                trainService.updateTrain(state.id, state);
                setDialogMessage('Train updated successfully');
                setSuccessDialogOpen(true);
            }
        }
    };

    function checkState() {
        return "";
    }

    function durationToMinutes(durationISO) {
        const duration = Duration.fromISO(durationISO);
        return duration.as('minutes');
    }

    return (
        <div className="container border border-primary rounded p-3">
            

            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h1 className="">Train Details</h1>
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
                <div className='col'>
                    <TextField
                        label="DepartureStation"
                        variant="outlined"
                        value={state.departureStation.name}
                        disabled={!isEditable}
                    />
                </div>
                <div className='col'>
                    <TextField
                        label="ArrivalStation"
                        variant="outlined"
                        value={state.arrivalStation.name}
                        disabled={!isEditable}
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
                    />
                </div>
                <div className='col'>
                    <TextField
                        label="Seats"
                        variant="outlined"
                        value={state.seats}
                        disabled={!isEditable}
                    />
                </div>
                <div className='col'>
                    <TextField
                        label="Duration in minutes"
                        variant="outlined"
                        value={durationToMinutes(state.duration)}
                        disabled={!isEditable}
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
    );
}

export default DetailTrainComponent;
