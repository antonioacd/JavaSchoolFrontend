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

/**
 * Component for searching schedules based on departure station, arrival station, and date.
 */
function SearchScheduleComponent() {
  const [state, setState] = useState({
    "departureStation": "",
    "arrivalStation": "",
    "date": dayjs(),
  });

  const [departureStationList, setDepartureStationList] = useState([]);
  const [arrivalStationList, setArrivalStationList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isNoSchedulesDialogOpen, setNoSchedulesDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of departure stations when the component mounts
    stationService.getStations().then((res) => {
      setDepartureStationList(res.data);
    });
  }, []);

  useEffect(() => {
    getStations();
  }, [state.departureStation]);

  /**
   * Fetch the list of arrival stations based on the selected departure station.
   */
  function getStations() {
    stationService.getStations().then((res) => {
      const updatedArrivalStationList = res.data;
      const filteredArrivalStationList = updatedArrivalStationList.filter(
        (station) => station.id !== state.departureStation.id
      );
      setArrivalStationList(filteredArrivalStationList);
    });
  }

  /**
   * Handle the selection of a departure station.
   * @param {object} selectedDepartureStation - The selected departure station.
   */
  const changeDepartureStationHandler = (selectedDepartureStation) => {
    if (selectedDepartureStation === null) {
      return;
    }
    setState({ ...state, departureStation: selectedDepartureStation.city });
  };

  /**
   * Handle the selection of an arrival station.
   * @param {object} selectedArrivalStation - The selected arrival station.
   */
  const changeArrivalStationHandler = (selectedArrivalStation) => {
    if (selectedArrivalStation === null) {
      return;
    }
    setState({ ...state, arrivalStation: selectedArrivalStation.city });
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

    scheduleService
      .getSchedulesByCitiesAndDate(departureStation, arrivalStation, date)
      .then((res) => {
        const filteredSchedules = res.data;

        if (filteredSchedules.length === 0) {
          setNoSchedulesDialogOpen(true);
        } else {
          setSchedules(filteredSchedules);
        }
      })
      .catch((error) => {
        console.log("Error while searching", error);
      });
  };

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
        open={isNoSchedulesDialogOpen}
        title="No Schedules Found"
        content="No schedules were found for the selected criteria."
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={() => setNoSchedulesDialogOpen(false)}
      />
    </div>
  );
}

export default SearchScheduleComponent;
