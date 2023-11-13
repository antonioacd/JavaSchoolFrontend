import React, { useState, useEffect } from "react";
import { IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import DeleteIcon from '@mui/icons-material/Delete';

import { Duration } from "luxon";
import ticketService from "../../../../services/TicketService";
import CustomizableDialog from "../../../Other/CustomizableDialog/CustomizableDialog";
dayjs.extend(duration);


function TicketItemComponent({ ticket }) {

  const handleTicketClick = (ticketId) => {
    console.log("Ticketid: ",ticketId);
  };

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [ticketId, setTicketId] = useState('');

  const handleDeleteTicket = (ticketId) => {
    setTicketId(ticketId)
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    
    console.log("Ticket; daFDS",ticket);

  }, []);

  /**
   * Handle confirming the deletion of selected schedules.
   */
  const handleConfirmDelete = () => {
    console.log("ticket siuu",ticketId);
    ticketService.deleteTicket(ticketId)
      .then(response => {
        if (response.status === 200) {
          setDeleteDialogOpen(false);
          window.location.reload();
        } else {
          setErrorDialogMessage('Unable to delete the ticket.');
          setErrorDialogOpen(true);
          setDeleteDialogOpen(false);
        }
      })
      .catch(error => {
        setErrorDialogMessage('Unable to delete the ticket.');
        setErrorDialogOpen(true);
        setDeleteDialogOpen(false);
      });
  };

  /**
   * Handle canceling the deletion of selected schedules.
   */
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  /**
   * Handle dismissing error dialogs.
   */
  const handleDismissError = () => {
    setErrorDialogOpen(false);
    window.location.reload();
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
            <div className="col">
                <IconButton className='bg-danger' onClick={() => handleDeleteTicket(ticket.id)}>
                    <DeleteIcon className="text-white"/>
                </IconButton>
            </div>
            {/* Success and error dialog components */}

            <CustomizableDialog
                type='warning'
                open={isDeleteDialogOpen}
                title="Are you sure you want to delete the selected records?"
                content="This action will permanently delete the selected records."
                agreeButtonLabel="Yes, delete"
                cancelButtonLabel='Cancel'
                showCancelButton={true}
                onCancel={handleCancelDelete}
                onAgree={handleConfirmDelete}
            />

        <CustomizableDialog
          type="success"
          open={isSuccessDialogOpen}
          title="Success"
          content={dialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => {
            setSuccessDialogOpen(false);
            window.location.reload();
          }}
        />
        <CustomizableDialog
          type="error"
          open={isErrorDialogOpen}
          title="Error"
          content={errorDialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => setErrorDialogOpen(false)}
        />
        </div>
  );
}

export default TicketItemComponent;
