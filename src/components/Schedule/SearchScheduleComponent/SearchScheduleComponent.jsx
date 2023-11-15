import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComboBoxCities from '../../Other/ComboBox/ComboBoxCities';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import './SearchScheduleComponent.css';
import stationService from '../../../services/StationService';
import scheduleService from '../../../services/ScheduleService';
import SearchItemScheduleComponent from './SearchItemScheduleComponent/SearchItemScheduleComponent';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import validator from 'validator';

/**
 * Component for searching schedules based on departure station, arrival station, and date.
 */
function SearchScheduleComponent() {
  const [state, setState] = useState({
    departureStation: "",
    arrivalStation: "",
    date: dayjs(),
  });

  const [departureStationList, setDepartureStationList] = useState([]);
  const [arrivalStationList, setArrivalStationList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('No schedules were found for the selected criteria.');


  const navigate = useNavigate();

  useEffect(() => {
    console.log("Obtiene las de salida");
    getDepartureStationList();
  }, []);

  useEffect(() => {
    console.log("Obtiene las de llegada");
    getArrivalStationList();
  }, [state.departureStation]);

  useEffect(() => {
      console.log("Obtiene las de salida");
      getDepartureStationList();
  }, [state.arrivalStation]);

  /**
   * Fetch and set the list of arrival stations based on the selected departure station.
   */
  function getArrivalStationList() {
    stationService.getStations()
      .then((response) => {
        const stations = response.data;
        const departureStationId = state.departureStation.id;
        
        const filteredStationList = stations.filter(
          (station) => station.id !== departureStationId
        );
  
        setArrivalStationList(filteredStationList);
      })
      .catch((error) => {
        setDialogMessage(error);
        setErrorDialogOpen(true);
      });
  }

  /**
   * Fetch and set the list of departure stations based on the selected arrival station.
   */
  function getDepartureStationList() {
    stationService.getStations()
      .then((response) => {
        const stations = response.data;
        const arrivalStationId = state.arrivalStation.id;
        
        const filteredStationList = stations.filter(
          (station) => station.id !== arrivalStationId
        );
  
        setDepartureStationList(filteredStationList);
      })
      .catch((error) => {
        setDialogMessage(error);
        setErrorDialogOpen(true);
      });
  }

  /**
   * Handler for changing the selected departure station.
   * @param {object} selectedDepartureStation - The selected departure station.
   */
  const changeDepartureStationHandler = (selectedDepartureStation) => {
    if (selectedDepartureStation === null) {
      return;
    }

    setState({
      ...state,
      departureStation: selectedDepartureStation,
    });
  };

  /**
   * Handler for changing the selected arrival station.
   * @param {object} selectedArrivalStation - The selected arrival station.
   */
  const changeArrivalStationHandler = (selectedArrivalStation) => {
    if (selectedArrivalStation === null) {
      return;
    }

    setState({
      ...state,
      arrivalStation: selectedArrivalStation,
    });
  };

  /**
   * Handle the selection of a date.
   * @param {object} newDate - The selected date.
   */
  const changeDateHandler = (newDate) => {
    setState({ ...state, date: newDate });
  };

  /**
   * Search for schedules based on the selected criteria (departure station, arrival station, and date).
   */
  const searchSchedules = () => {
    const { departureStation, arrivalStation, date } = state;

    const error = checkState();

    if (error) {
      setDialogMessage(error);
      setErrorDialogOpen(true);
    } else {
      setDialogMessage('No schedules were found for the selected criteria.');
      scheduleService
        .getSchedulesByCitiesAndDate(departureStation, arrivalStation, date)
        .then((res) => {
          const filteredSchedules = res.data;

          if (filteredSchedules.length === 0) {
            setErrorDialogOpen(true);
          } else {
            setSchedules(filteredSchedules);
          }
        })
        .catch((error) => {
          console.log("Error while searching", error);
        });
      }
  };

  function checkState() {

    console.log("Departure: ",state.departureStation);
    console.log("Arrival: ",state.arrivalStation);
  
    if (state.departureStation === "" || state.arrivalStation === "") {
      return 'Please fill in all fields';
    }
  
    return '';
  }

  return (
    <div>
      <div className="full-screen">
        <div className='row container-custom-big'>
          <div className="row">
            <div className="col">
              <ComboBoxCities
                label="Departure Station"
                options={departureStationList}
                onSelect={changeDepartureStationHandler}
              />
            </div>

            <div className="col">
              <ComboBoxCities
                label="Arrival Station"
                options={arrivalStationList}
                onSelect={changeArrivalStationHandler}
              />
            </div>

            <div className="col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={state.date}
                  onChange={changeDateHandler}
                  disablePast={true}
                />
              </LocalizationProvider>
            </div>

            <div className="col mt-2">
              <button type="button" className="btn btn-primary" onClick={searchSchedules}>
                Search Schedules
              </button>
            </div>
          </div>
          <div className='row mt-4'>
            {schedules.map((schedule, index) => (
              <SearchItemScheduleComponent key={index} schedule={schedule} />
            ))}
          </div>
        </div>
      </div>

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

export default SearchScheduleComponent;
