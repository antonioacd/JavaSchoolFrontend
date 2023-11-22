import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
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
    <div className="full-screen">
      <div className='container-custom-extra-big'>
        <div className='text-left'>
            <h5>Schedule Info</h5>
        </div>
             
        <div className='container-custom-bordered-center'>
            <div className="row">
                <div className="col">
                    <Typography variant="h6">{schedule.train.departureStation.name}</Typography>
                    <Typography>{schedule.train.departureStation.city} - {schedule.departureTime.substring(11, 16)}</Typography>
                </div>
                <div className="col arrow">
                    <p>➔</p>
                </div>
                <div className="col">
                    <Typography variant="h6">{schedule.train.arrivalStation.name}</Typography>
                    <Typography>{schedule.train.arrivalStation.city} - {schedule.arrivalTime.substring(11, 16)}</Typography>
                </div>
            </div>
            <div className="row mt-4 justify-content-center">
                <div className="col">
                    <Typography variant="h6">Duration</Typography>
                    <Typography>{formatDuration(schedule.train.duration)}</Typography>
                </div>
                <div className="col">
                <Typography variant="h6">Number</Typography>
                    <Typography>{schedule.train.trainNumber}</Typography>
                </div>
                <div className="col">
                <Typography variant="h6">Seats</Typography>
                <Typography>{schedule.train.seats}</Typography>
                </div>
            </div>
        </div>

        <div className='mt-2'>
            <h5>User Info</h5>
        </div>

        <div className='container-custom-bordered-center'>
            <div className="row">
                <div className="col">
                    <Typography variant="h6">{user.name} {user.surname}</Typography>
                </div>
                <div className="col">
                    <Typography variant="h6">{user.email}</Typography>
                </div>
            </div>
        </div>

        <div className="row mt-4 justify-content-center">
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
    </div>
  );
}

export default BuyTicketComponent;
