import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainService from '../../services/TrainService';
import StationService from '../../services/StationService';
import Alert from 'react-bootstrap/Alert';
import "./CreateTrainComponent.css";
import ComboBoxStations from '../ComboBox/ComboBoxStations';

// Train Component
function CreateTrainComponent() {
    const [state, setState] = useState({
        seats: '',
        currentStation: {
            id: '',
            name: '',
            city: ''
        }
    });

    // Init the navigate variable
    const navigate = useNavigate();

    // Set the states of alerts
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [stationList, setStationList] = useState([]);

    useEffect(() => {
        // Fetch the data and update departureStationList here
        StationService.getStations().then((res) => {
            const updatedStationList = res.data;
            setStationList(updatedStationList);
        });
    }, []);

    const changeArrivalStationHandler = (selectedStation) => {
        if (selectedStation === null) {
            return;
        }

        stationList.forEach(station => {
            if (station.id === selectedStation.id) {
                setState({ ...state, currentStation: station });
            }
        });
    };


    // Change seats whith the user input
    const changeSeatsHandler = (event) => {
        setState({ ...state, seats: event.target.value });
    };

    // Go to home page
    const cancel = () => {
        navigate("/");
    };

    // Save the train in the database
    const saveTrain = (event) => {
        event.preventDefault();

        // Check if the fields are empty
        if (checkState() === 1) {
            return;
        }

        console.log("State", state);

        TrainService.createTrain(state)
            .then(response => {
                if (response.status === 200) {
                    console.log('Train added successfully:', response.data);
                    setShowSuccessAlert(true);
                    setShowErrorAlert(false);
                } else {
                    console.error('Error adding train:', response.data);
                    setShowSuccessAlert(false);
                    setShowErrorAlert(true);
                }
            })
            .catch(error => {
                console.error('Error adding train:', error);
                setShowSuccessAlert(false);
                setShowErrorAlert(true);
            });
    };

    function checkState() {
        if (state.seats === "") {
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
            return 1;
        }
        return 0;
    }

    

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <h1 className='text-center'>Create train</h1>
            </div>

            <div className='card-body'>
                <form>
                    <div className="form-group">
                        <h5>Number of seats</h5>
                        <input
                            placeholder='Example: 100'
                            type="text"
                            className="form-control"
                            name="numberOfSeats"
                            value={state.seats}
                            onChange={changeSeatsHandler}
                            style={{ width: '200px', margin: 'auto' }}
                        />
                        <h5>Current Station</h5>
                        <ComboBoxStations options={stationList} onSelect={changeArrivalStationHandler} />
                    </div>
                    <div className='justify-content-around mt-2'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={saveTrain}
                        >
                            Save train
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancel}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <div className="alert-container">
                {showSuccessAlert && (
                    <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="bottom-alert">
                        Train added successfully.
                    </Alert>
                )}

                {showErrorAlert && (
                    <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible className="bottom-alert">
                        Error adding train. Please try again.
                    </Alert>
                )}
            </div>
        </div>
    );
}

export default CreateTrainComponent;
