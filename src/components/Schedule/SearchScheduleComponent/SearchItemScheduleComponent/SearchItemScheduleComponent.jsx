import React from 'react';
import './SearchItemScheduleComponent.css';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

/**
 * Component that displays the details of a train schedule.
 * @param {object} schedule - The object containing schedule details.
 * @returns {JSX.Element} - The visual representation of the schedule details.
 */
function SearchItemScheduleComponent({ schedule }) {
  const navigate = useNavigate();

  const handleScheduleClick = (scheduleId) => {
    navigate(`/ticket/buy/${scheduleId}`);
  };

  /**
   * Format duration string to a more readable format.
   * @param {string} durationString - Duration in ISO format.
   * @returns {string} - Formatted duration string.
   */
  function formatDuration(durationString) {
    const duration = dayjs.duration(durationString);
    return `${duration.hours()} hours, ${duration.minutes()} mins`;
  }

  const availableSeats = schedule.train.seats - schedule.occupiedSeats;
  const isSeatsAvailable = availableSeats > 0;
  const scheduleClassName = `schedule-item ${isSeatsAvailable ? '' : 'bg-secondary'}`;

  return (
    <div className="container">
      <div className={scheduleClassName} onClick={() => isSeatsAvailable && handleScheduleClick(schedule.id)}>
        <div className="departure">
          <p>{schedule.train.departureStation.name}</p>
          <h3>{schedule.departureTime.substring(11, 16)}</h3>
          <p>{schedule.train.departureStation.city}</p>
        </div>
        <div>
          <div className="arrow">
            <p>➔</p>
          </div>
          <p>{formatDuration(schedule.train.duration)}</p>
          <p>{isSeatsAvailable ? `${availableSeats} Available seats` : 'No Available seats'}</p>
        </div>

        <div className="arrival">
          <p>{schedule.train.arrivalStation.name}</p>
          <h3>{schedule.arrivalTime.substring(11, 16)}</h3>
          <p>{schedule.train.arrivalStation.city}</p>
        </div>
      </div>
    </div>
  );
}

export default SearchItemScheduleComponent;
