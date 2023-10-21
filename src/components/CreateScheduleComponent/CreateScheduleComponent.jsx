import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleService from '../../services/ScheduleService';
import Alert from 'react-bootstrap/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import StationService from '../../services/StationService';
import AutocompleteComponent from '../AutocompleteComponent/AutocompleteComponent';
import TrainService from '../../services/TrainService';
import ComboBoxTrains from '../ComboBox/ComboBoxTrains';
import ComboBoxStations from '../ComboBox/ComboBoxStations';

/**
 * 
 * @returns 
 */
function CreateScheduleComponent() {
    const [state, setState] = useState(
        {
            "departureTime": "",
            "arrivalTime": "",
            "occupiedSeats": "0",
            "departureStation": {
              "id": 0,
              "name": "",
              "city": ""
            },
            "arrivalStation": {
              "id": 0,
              "name": "",
              "city": ""
            },
            "train": {
              "id": 0,
              "seats": ""
            }
        }
    );

    // Init the navigate variable
    const navigate = useNavigate();


    // Set the states of alerts
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [selectedDepartureDate, setSelectedDepartureDate] = useState(new Date());
    const [selectedArrivalDate, setSelectedArrivalDate] = useState(new Date());

    const [departureStationList, setDepartureStationList] = useState([]);
    const [departureStationNameList, setDepartureStationNameList] = useState([]);

    const [arrivalStationList, setArrivalStationList] = useState([]);

    const [trainSeatsList, setTrainNameList] = useState([]);
    const [trainList, setTrainList] = useState([]);

    useEffect(() => {
        // You can fetch the data and update departureStationList here
        StationService.getStations().then((res) => {
            const updatedDepartureStationList = res.data;
            setDepartureStationList(updatedDepartureStationList);

            console.log("Lista estaciones", updatedDepartureStationList);

            updatedDepartureStationList.forEach(station => {
                console.log(station.name);
                departureStationNameList.push(station.name);
            });

            console.log(departureStationNameList);
        });

        // You can fetch the data and update departureStationList here
        TrainService.getTrains().then((res) => {
            const updatedTrainList = res.data;
            setTrainList(updatedTrainList);

            updatedTrainList.forEach(train => {
                trainSeatsList.push(train.seats);
            });
        });


    }, []);


    const changeDepartureTimeHandler = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        setSelectedDepartureDate(date); // Actualiza el estado de la fecha seleccionada
        setState({ ...state, departureTime: formattedDate });
    };

    const changeArrivalTimeHandler = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        setSelectedArrivalDate(date); // Actualiza el estado de la fecha seleccionada
        setState({ ...state, arrivalTime: formattedDate });
    };

    // Change departureStation whith the user input
    const changeDepartureStationHandler = (selectedDepartureStation) => {

        if(selectedDepartureStation === null){
            return;
        }

        departureStationList.forEach(station => {
            if(station.id === selectedDepartureStation.id){
                setState({ ...state, departureStation: station })
            }    
        });

        // You can fetch the data and update departureStationList here
        StationService.getStations().then((res) => {
            const updatedArrivalStationList = res.data;
            setArrivalStationList(updatedArrivalStationList);

            console.log("Lista estaciones", updatedArrivalStationList);

            updatedArrivalStationList.forEach(station => {
                console.log(station.name);
                if(station.name === state.departureStation.name){
                    return;
                }
                arrivalStationList.push(station);
            });

            //console.log(arrivalStationNameList);
        });
    };

    // Change arrivalStation whith the user input
    const changeArrivalStationHandler = (selectedArrivalStation) => {

        if(selectedArrivalStation === null){
            return;
        }

        arrivalStationList.forEach(station => {
            if(station.id === selectedArrivalStation.id){
                setState({ ...state, arrivalStation: station })
            }    
        });
    };

    const changeTrainHandler = (selectedTrain) => {

        if(selectedTrain === null){
            return;
        }

        trainList.forEach(train => {
            if(train.id === selectedTrain.id){
                setState({ ...state, train: train })
            }
        });
    };

    // Go to home page
    const cancel = () => {
        navigate("/");
    };

    
    // Save the station in the database
    const saveSchedule = (event) => {
        event.preventDefault();

        console.log("Schedule",state);

        

        // Check if the fields are empty
        if (checkState() === 1) {
            return;
        }

        // 
        ScheduleService.createSchedule(state)
            .then(response => {
                if (response.status === 200) {
                    console.log('Schedule added successfully:', response.data);
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
                        <h5>Departure Time</h5>
                        <DatePicker
                            selected={selectedDepartureDate}
                            onChange={changeDepartureTimeHandler}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm" // Formato de fecha y hora
                        />
                        <h5>Arrival Time</h5>
                        <DatePicker
                            selected={selectedArrivalDate}
                            onChange={changeArrivalTimeHandler}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm" // Formato de fecha y hora
                        />
                        <h5>Departure Station</h5>
                        <ComboBoxStations options={departureStationList} onSelect={changeDepartureStationHandler} />
                        https://github.com/antonioacd/JavaSchoolFrontend.git                  <h5>Arrival Station</h5>
                        <ComboBoxStations options={arrivalStationList} onSelect={changeArrivalStationHandler} />
                        <h5>Train</h5>
                        <ComboBoxTrains options={trainList} onSelect={changeTrainHandler} />
                    </div>

                    <div className='justify-content-around mt-2'>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={saveSchedule}
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
                        Schedule added successfully.
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

export default CreateScheduleComponent;
