import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import stationService from '../../../services/StationService';

function DetailStationComponent() {
    // Obtén el ID de la URL
    const { id } = useParams();

    const [state, setState] = useState({
        id: "",
        name: "",
        city: ""
    });

    const navigate = useNavigate();

    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [departureStationList, setDepartureStationList] = useState([]);
    const [arrivalStationList, setArrivalStationList] = useState([]);
    const [savedState, setSavedState] = useState([]);
    const [parsedDuration, setParsedDuration] = useState([]);

    useEffect(() => {
        stationService.getStationById(id)
            .then((response) => {
                if (response.status === 200) {
                    const stationData = response.data;
                    setState(stationData);
                    setSavedState(stationData);
                } else {
                    console.error("Error fetching station data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching station data:", error);
            });
    }, []);

    const saveStation = (event) => {
        event.preventDefault();
        if (isEditable) {
            const error = checkState();
    
            if (error) {
                setDialogMessage('Error adding station. Please try again.');
                setErrorDialogOpen(true);
            } else {
                stationService.updateStation(state.id, state)
                    .then((response) => {
                        if (response.status === 200) { // Verificar el estado de la respuesta
                            setDialogMessage('Station updated successfully');
                            setSuccessDialogOpen(true);
                        } else {
                            setDialogMessage('Error updating station. Please try again.'); // Mensaje de error genérico
                            setErrorDialogOpen(true);
                        }
                    })
                    .catch((error) => {
                        setDialogMessage(error.message); // Mostrar el mensaje de error
                        setErrorDialogOpen(true);
                    });
            }
        }
    };
    
    function checkState() {
        return "";
    }

    const changeCityHandler = (event) => {
      setState({ ...state, city: event.target.value });
    };
  
    const changeNameHandler = (event) => {
      setState({ ...state, name: event.target.value });
    };

    function handleEditButton(){
        setIsEditable(!isEditable)

        if(isEditable){
          setState(savedState);
        }
    }

    return (
        <div className="full-screen">
            <div className='container-custom'>
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <h1 className="">Station Details</h1>
                    <IconButton
                    className="bg-primary"
                    onClick={handleEditButton}
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
                            label="Station Name"
                            variant="outlined"
                            value={state.name}
                            disabled={!isEditable}
                            onChange={changeNameHandler}
                        />
                    </div>
                    <div className='col'>
                        <TextField
                            label="Station City"
                            variant="outlined"
                            value={state.city}
                            disabled={!isEditable}
                            onChange={changeCityHandler}
                        />
                    </div>
                </div>
                    
                <div className="row mt-4 justify-content-between">
                    {isEditable ? (
                        <button type="button" className="btn btn-primary" onClick={saveStation}>
                            Save station
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

export default DetailStationComponent;
