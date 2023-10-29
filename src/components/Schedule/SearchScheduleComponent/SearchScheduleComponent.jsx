import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComboBoxStations from '../../Other/ComboBox/ComboBoxStations';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import './SearchScheduleComponent.css';
import stationService from '../../../services/StationService';
import scheduleService from '../../../services/ScheduleService';
import ComboBoxCities from '../../Other/ComboBox/ComboBoxCities';
import SearchItemScheduleComponent from './SearchItemScheduleComponent/SearchItemScheduleComponent';

function SearchScheduleComponent() {
    const [state, setState] = useState({
        "departureStation": "",
        "arrivalStation": "",
        "date": dayjs(),
    });

    const [departureStationList, setDepartureStationList] = useState([]);
    const [arrivalStationList, setArrivalStationList] = useState([]);
    const [schedules, setSchedules] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        stationService.getStations().then((res) => {
            console.log(res.data);
              setDepartureStationList(res.data);
            });
    }, []);

    useEffect(() => {
        getStations();
    }, [state.departureStation]);

    function getStations() {
        stationService.getStations().then((res) => {
          const updatedArrivalStationList = res.data;
          const filteredArrivalStationList = updatedArrivalStationList.filter(
            (station) => station.id !== state.departureStation.id
          );
          setArrivalStationList(filteredArrivalStationList);
        });
      }

    const changeDepartureStationHandler = (selectedDepartureStation) => {
        if (selectedDepartureStation === null) {
            return;
        }
        setState({ ...state, departureStation: selectedDepartureStation.city });
    };

    const changeArrivalStationHandler = (selectedArrivalStation) => {
        if (selectedArrivalStation === null) {
            return;
        }
        setState({ ...state, arrivalStation: selectedArrivalStation.city });
    };

    const changeDateHandler = (newDate) => {
        setState({ ...state, date: newDate });
    };

    const searchSchedules = () => {
      const selectedDate = state.date.format('YYYY-MM-DD'); // Obtén solo el día de la fecha seleccionada
  
      scheduleService.getSchedules().then((res) => {
          const allSchedules = res.data;
  
          const filteredSchedules = allSchedules.filter((schedule) => {
              const isDepartureCityMatch = schedule.train.departureStation.city === state.departureStation;
              const isArrivalCityMatch = schedule.train.arrivalStation.city === state.arrivalStation;
  
              // Compara solo el día de las fechas
              const isDateMatch = dayjs(schedule.departureTime).format('YYYY-MM-DD') === selectedDate;
  
              // Combinar las tres condiciones con un operador lógico "&&" (y)
              return isDepartureCityMatch && isArrivalCityMatch && isDateMatch;
          });
  
          setSchedules(filteredSchedules);
      });
    }
    return (
        <div>
            <div className="container">
                <div className="form-container">
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
                </div>
            </div>
            <div className='mt-4'>
                {schedules.map((schedule, index) => (
                    <SearchItemScheduleComponent key={index} schedule={schedule} />
                ))}
            </div>
        </div>
    );
}

export default SearchScheduleComponent;