import React, { useState, useEffect } from "react";
import { IconButton, div } from '@mui/material';
import dayjs from 'dayjs';
import "./TicketItemComponent.css";
import jsPDF from 'jspdf';
import duration from 'dayjs/plugin/duration';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
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


  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
  
    // Configuración para el título principal centrado y en negrita
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(90, 20, 'RAILWAY TRANSPORT COMPANY Ticket', { align: 'center' });
    pdf.setFont('helvetica', 'normal');
  
    // Configuración para la información
    pdf.setFontSize(12);
  
    // Departure Station
    pdf.setFont('helvetica', 'bold');
    pdf.text(20, 40, 'Departure Station:');
    pdf.setFont('helvetica', 'normal');
    pdf.text(70, 40, ticket.schedule.train.departureStation.name);
  
    // Departure City
    pdf.setFont('helvetica', 'bold');
    pdf.text(20, 50, 'Departure City:');
    pdf.setFont('helvetica', 'normal');
    pdf.text(70, 50, ticket.schedule.train.departureStation.city);
  
    // Departure Time
    pdf.setFont('helvetica', 'bold');
    pdf.text(20, 60, 'Departure Time:');
    pdf.setFont('helvetica', 'normal');
    pdf.text(70, 60, ticket.schedule.departureTime.substring(11, 16));
  
    // Repite el mismo patrón para otros campos...
  
    // Guardar el PDF como un archivo descargable
    pdf.save('ticket.pdf');
  };
  
  
  

  return (
    <div className="main-2">
      <div className="ticket-main-2">
        <div className='ticket-container-2'>
            <div className="row">
                <div className='col cell-2 header'>RAILWAY TRANSPORT COMPANY</div>
            </div>
            <div className="row">
                <div className="col cell-2">
                  <div className='info-item-2'>{ticket.schedule.train.departureStation.name}</div>
                  <div className='info-detail-2'>{ticket.schedule.train.departureStation.city} - {ticket.schedule.departureTime.substring(11, 16)}</div>
                </div>
                <div className="col cell-2">
                  <div className='info-item-2'>{ticket.schedule.train.arrivalStation.name}</div>
                  <div className='info-detail-2'>{ticket.schedule.train.arrivalStation.city} - {ticket.schedule.arrivalTime.substring(11, 16)}</div>
                </div>
            </div>
            <div className="row">
                <div className="col cell-2">
                  <div className='info-item-2'>Duration</div>
                  <div className='info-detail-2'>{formatDuration(ticket.schedule.train.duration)}</div>
                </div>
                <div className="col cell-2">
                  <div className='info-item-2'>Number</div>
                  <div className='info-detail-2'>{ticket.schedule.train.trainNumber}</div>
                </div>
                <div className="col cell-2">
                  <div className='info-item-2'>Seats</div>
                  <div className='info-detail-2'>{ticket.schedule.train.seats}</div>
                </div>
            </div>
            <div className="row">
                <div className="col cell-2">
                  <div className='info-item-2'>Seat number</div>
                  <div className='info-detail-2'>{ticket.seatNumber}/{ticket.schedule.train.seats}</div>
                </div>
                <div className="col cell-2">
                  <div className='info-item-2'>Occupied Seats</div>
                  <div className='info-detail-2'>{ticket.schedule.occupiedSeats}</div>
                </div>
            </div>
          </div>
          </div>
          <div className="row mt-2 buttons-2"> 
            <div className="col">
              <IconButton className='bg-danger' onClick={() => handleDeleteTicket(ticket.id)}>
                <DeleteIcon className="text-white"/>
              </IconButton>
            </div>
            <div className="col">
              <IconButton className='bg-primary ml-2' onClick={handleDownloadPDF}>
                <ArrowCircleDownIcon className="text-white ml-2"></ArrowCircleDownIcon>
              </IconButton>
            </div>
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
