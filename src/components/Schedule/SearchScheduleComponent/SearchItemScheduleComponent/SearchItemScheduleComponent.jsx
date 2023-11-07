import React from 'react';
import './SearchItemScheduleComponent.css';
import { useNavigate } from 'react-router-dom';

/**
 * Component that displays the details of a train schedule.
 * @param {object} schedule - The object containing schedule details.
 * @returns {JSX.Element} - The visual representation of the schedule details.
 */
function SearchItemScheduleComponent({ schedule }) {

  const navigate = useNavigate();

  const handleScheduleClick = (scheduleId) => {
    console.log("Scheduleid: ",scheduleId);
    navigate(`/ticket/buy/${scheduleId}`);
  };

  return (
    <div className="schedule-item" onClick={() => handleScheduleClick(schedule.id)}>
      <div className="departure">
        <p>Departure</p>
        <h3>{schedule.train.departureStation.name}</h3>
        <p>{schedule.train.departureStation.city} - {schedule.departureTime.substring(11, 16)}</p>
      </div>
      <div className="arrow">
        <p>➔</p>
      </div>
      <div className="arrival">
        <p>Arrival</p>
        <h3>{schedule.train.arrivalStation.name}</h3>
        <p>{schedule.train.arrivalStation.city} - {schedule.arrivalTime.substring(11, 16)}</p>
      </div>
    </div>
  );
}

export default SearchItemScheduleComponent;
