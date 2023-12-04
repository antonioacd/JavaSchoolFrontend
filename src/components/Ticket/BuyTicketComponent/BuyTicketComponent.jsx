import React, { useState, useEffect } from 'react';
import "./BuyTicketComponent.css";
import { div, Button } from '@mui/material';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import userService from '../../../services/UserService';
import ticketService from '../../../services/TicketService';
import scheduleService from '../../../services/ScheduleService';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Duration } from "luxon";
dayjs.extend(duration);


function BuyTicketComponent() {

    const { scheduleId } = useParams();

  const [ticket, setTicket] = useState({
    seatNumber: '',
    user: { id: 0 },
    schedule: { id: 0 }
  });

  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    rol: { id: 1 },
  });

  const [schedule, setSchedule] = useState({
    departureTime: '',
    arrivalTime: '',
    occupiedSeats: 0,
    train: {
      id: 0,
      departureStation: { name: '', city: ''},
      arrivalStation: { name: '', city: ''},
      duration: '',
      trainNumber: ''
    },
  });

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    getSchedule();
    getUser();
  }, [scheduleId]);

  useEffect(() => {
    getSchedule();
    getUser();
  }, []);

  useEffect(() => {
    createTicket();
  }, [schedule, user]);

  function createTicket(){
    setTicket({
        seatNumber: 0,
        user: user,
        schedule: schedule
    });
  }

  function getSchedule(){
    scheduleService.getScheduleById(scheduleId)
            .then((response) => {
                if (response.status === 200) {
                    const scheduleData = response.data;
                    setSchedule(scheduleData);
                } else {
                    console.error("Error fetching schedule data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });
  }

  function getUser(){
    userService.getUserByEmail(localStorage.getItem('email'))
            .then((response) => {
                if (response.status === 200) {
                    const userData = response.data;
                    setUser(userData);
                } else {
                    console.error("Error fetching user data.");
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
  }

  /**
   * Format duration string to a more readable format.
   * @param {string} durationString - Duration in ISO format.
   * @returns {string} - Formatted duration string.
   */
  function formatDuration(durationString) {
    const duration = dayjs.duration(durationString);
    return `${duration.hours()} hours, ${duration.minutes()} mins`;
  }

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const buyTicket = () => {
    console.log(ticket);
    ticketService.createTicket(ticket)
    .then(response => {
        if (response.status === 200) {
          setDialogMessage('Schedule added successfully');
          setSuccessDialogOpen(true);
        } else {
          setDialogMessage("You already have a ticket for this schedule");
          setErrorDialogOpen(true);
        }
      })
      .catch(error => {
        setDialogMessage("You already have a ticket for this schedule");
        setErrorDialogOpen(true);
      });
  };

  const ticketIsValid = true; // Reemplaza con la lógica real para validar el ticket.

  return (
    <div className='main'>
      <div className='ticket-main'>
        <div className='ticket-container'>
          <div className="row">
              <div className='col header'>RAILWAY TRANSPORT COMPANY</div>
          </div>
          <div className="row">
            <div className="col cell">
              <div className='info-item'>PASSENGER</div>
              <div className='info-detail'>ANTONIO CABELLO</div>
            </div>
          </div>
          <div className="row">
            <div className="col cell">
              <div className='info-item'>DEPART</div>
              <div className='info-detail'>{schedule.train.departureStation.name}</div>
            </div>
            <div className="col cell">
              <div className='info-item'>ARRIVE</div>
              <div className='info-detail'>{schedule.train.arrivalStation.name}</div>
            </div>
          </div>
          <div className="row">
            <div className="col cell">
              <div className='info-item'>DATE</div>
              <div className='info-detail'>{schedule.departureTime.substring(0, 10)}</div>
            </div>
            <div className="col cell">
              <div className='info-item'>TIME</div>
              <div className='info-detail'>{schedule.arrivalTime.substring(11, 16)}</div>
            </div>
          </div>
          <div className="row">
            <div className="col cell">
              <div className='info-item'>DURATION</div>
              <div className='info-detail'>{formatDuration(schedule.train.duration)}</div>
            </div>
            <div className="col cell">
              <div className='info-item'>NUMBER</div>
              <div  className='info-detail'>{schedule.train.trainNumber}</div>
            </div>
            <div className="col cell">
              <div className='info-item'>SEATS</div>
              <div className='info-detail'>{schedule.train.seats}</div>
            </div>
          </div>
        </div>
      </div>
        <div className="row mt-4 buttons">
          <button
            className='btn btn-primary'
            onClick={buyTicket}
          >
            BUY TICKET
          </button>
          <button
            className='btn btn-secondary mt-2'
            onClick={() => navigate("/schedule/search")}
          >
            SEARCH OTHER SCHEDULES
          </button>
        </div>
  
        <CustomizableDialog
          type='success'
          open={isSuccessDialogOpen}
          title="Success"
          content={dialogMessage}
          agreeButtonLabel="Accept"
          showCancelButton={false}
          onAgree={handleSuccessDialogClose}
        />
  
        <CustomizableDialog
          type='error'
          open={isErrorDialogOpen}
          title="Error"
          content={dialogMessage}
          agreeButtonLabel="Accept"
          showCancelButton={false}
          onAgree={handleErrorDialogClose}
        />
      </div>
  );
  
}

export default BuyTicketComponent;
