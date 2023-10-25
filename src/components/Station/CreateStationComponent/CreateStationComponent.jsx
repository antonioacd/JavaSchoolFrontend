import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StationService from '../../../services/StationService';
import Alert from 'react-bootstrap/Alert';
import TextField from '@mui/material/TextField'; // Import TextField from MUI
import Button from '@mui/material/Button'; // Import Button from MUI
import './CreateStationComponent.css';
import trainService from '../../../services/TrainService';

// Station Component
function CreateStationComponent() {
    const [state, setState] = useState({
        name: '',
        city: ''
    });

    // Init the navigate variable
    const navigate = useNavigate();

    // Set the states of alerts
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    // Change name with the user input
    const changeNameHandler = (event) => {
        setState({ ...state, name: event.target.value });
    };

    // Change city with the user input
    const changeCityHandler = (event) => {
        setState({ ...state, city: event.target.value });
    };

    // Go to home page
    const cancel = () => {
        navigate('/');
    };

    // Save the station in the database
    const saveStation = (event) => {
        event.preventDefault();

        const stationData = {
            name: state.name,
            city: state.city
        };

        // Check if the fields are empty
        if (checkState() === 1) {
            return;
        }

        StationService.createStation(stationData)
            .then(response => {
                if (response.status === 200) {
                    console.log('Station added successfully:', response.data);
                    setShowSuccessAlert(true);
                    setShowErrorAlert(false);
                } else {
                    console.error('Error adding station:', response.data);
                    setShowSuccessAlert(false);
                    setShowErrorAlert(true);
                }
            })
            .catch(error => {
                console.error('Error adding station:', error);
                setShowSuccessAlert(false);
                setShowErrorAlert(true);
            });

    };

    function checkState() {
        if (state.name === '' || state.city === '') {
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
            return 1;
        }
        return 0;
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <h1 className='text-center'>Create station</h1>
            </div>
    
            <div className="card-body">
                <div className="row mt-4 justify-content-center">
                    <div className="col">
                        <TextField
                            label="Station Name"
                            variant="outlined"
                            value={state.name}
                            onChange={changeNameHandler}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="col">
                        <TextField
                            label="Station City"
                            variant="outlined"
                            value={state.city}
                            onChange={changeCityHandler}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
    
                <div className="row mt-4 justify-content-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={saveStation}
                    >
                        Save station
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary mt-2"
                        onClick={cancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
    
            <div className="alert-container">
                {showSuccessAlert && (
                    <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="bottom-alert">
                        Station added successfully.
                    </Alert>
                )}
    
                {showErrorAlert && (
                    <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible className="bottom-alert">
                        Error adding station. Please try again.
                    </Alert>
                )}
            </div>
        </div>
    );
    
}

export default CreateStationComponent;
