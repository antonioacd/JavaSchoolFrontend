import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StationService from '../../services/StationService';
import Alert from 'react-bootstrap/Alert';
import "./CreateStationComponent.css";

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

    // Change name whith the user input
    const changeNameHandler = (event) => {
        setState({ ...state, name: event.target.value });
    };

    // Change name whith the user input
    const changeCityHandler = (event) => {
        setState({ ...state, city: event.target.value });
    };

    // Go to home page
    const cancel = () => {
        navigate("/");
    };

    // Save the station in the database
    const saveStation = (event) => {
        event.preventDefault();

        const stationData = {
            name: state.name,
            city: state.city
        }

        // Check if the fields are empty
        if (checkState() === 1) {
            return;
        }

        // 
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
        if (state.name === "" || state.city === "") {
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
            return 1;
        }
        return 0;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <h1 className='text-center'>Create station</h1>
            </div>

            <div className='card-body'>
                <form>
                    <div className="form-group">
                        <h5>Name</h5>
                        <input
                            placeholder='Name'
                            type="text"
                            className="form-control"
                            name="name"
                            value={state.name}
                            onChange={changeNameHandler}
                            style={{ width: '200px', margin: 'auto' }}
                        />
                        <h5>City</h5>
                        <input
                            placeholder='City'
                            type="text"
                            className="form-control"
                            name="city"
                            value={state.city}
                            onChange={changeCityHandler}
                            style={{ width: '200px', margin: 'auto' }}
                        />
                    </div>

                    <div className='justify-content-around mt-2'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={saveStation}
                        >
                            Save station
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
