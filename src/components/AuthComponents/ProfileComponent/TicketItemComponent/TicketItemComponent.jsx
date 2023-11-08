import React, { useState, useEffect } from "react";
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Duration } from "luxon";
dayjs.extend(duration);


function TicketItemComponent({ ticket }) {

  const handleTicketClick = (ticketId) => {
    console.log("Ticketid: ",ticketId);
  };

  useEffect(() => {
    
    console.log("Ticket; daFDS",ticket);

  }, []);

  /**
   * Format duration string to a more readable format.
   * @param {string} durationString - Duration in ISO format.
   * @returns {string} - Formatted duration string.
   */
  function formatDuration(durationString) {
    const duration = dayjs.duration(durationString);
    return `${duration.hours()} hours, ${duration.minutes()} mins`;
  }

  return (
    <div className='container-custom-bordered-center'>
            <div className="row">
                <div className="col">
                    <Typography variant="h6">{ticket.schedule.train.departureStation.name}</Typography>
                    <Typography>{ticket.schedule.train.departureStation.city} - {ticket.schedule.departureTime.substring(11, 16)}</Typography>
                </div>
                <div className="col arrow">
                    <p>➔</p>
                </div>
                <div className="col">
                    <Typography variant="h6">{ticket.schedule.train.arrivalStation.name}</Typography>
                    <Typography>{ticket.schedule.train.arrivalStation.city} - {ticket.schedule.arrivalTime.substring(11, 16)}</Typography>
                </div>
            </div>
            <div className="row mt-4 justify-content-center">
                <div className="col">
                    <Typography variant="h6">Duration</Typography>
                    <Typography>{formatDuration(ticket.schedule.train.duration)}</Typography>
                </div>
                <div className="col">
                <Typography variant="h6">Number</Typography>
                    <Typography>{ticket.schedule.train.trainNumber}</Typography>
                </div>
                <div className="col">
                <Typography variant="h6">Seats</Typography>
                    <Typography>{ticket.schedule.train.seats}</Typography>
                </div>
            </div>
            <div className="row mt-4 justify-content-center">
                <div className="col">
                    <Typography variant="h6">Seat number</Typography>
                    <Typography>{ticket.seatNumber}/{ticket.schedule.train.seats}</Typography>
                </div>
                <div className="col">
                <Typography variant="h6">Occupied Seats</Typography>
                    <Typography>{ticket.schedule.occupiedSeats}</Typography>
                </div>
            </div>
        </div>
  );
}

export default TicketItemComponent;
