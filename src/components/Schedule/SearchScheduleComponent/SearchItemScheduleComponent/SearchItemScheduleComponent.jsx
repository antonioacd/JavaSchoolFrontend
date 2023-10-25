import React from 'react';
import './SearchItemScheduleComponent.css'; // Importa tu archivo de CSS

function SearchItemScheduleComponent({ schedule }) {
  return (
    <div className="schedule-item">
  <div className="departure">
    <p>Departure</p>
    <h3>{schedule.departureStation.name}</h3>
    <p>{schedule.departureStation.city} - {schedule.departureTime.substring(11, 16)}</p>
  </div>
  <div className="arrow">
    <p>➔</p>
  </div>
  <div className="arrival">
    <p>Arrival</p>
    <h3>{schedule.arrivalStation.name}</h3>
    <p>{schedule.arrivalStation.city} - {schedule.arrivalTime.substring(11, 16)}</p>
  </div>
</div>

  );
}

export default SearchItemScheduleComponent;

