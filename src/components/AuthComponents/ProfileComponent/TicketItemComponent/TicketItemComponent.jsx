import React, { useState, useEffect } from "react";
import { IconButton, div } from '@mui/material';
import dayjs from 'dayjs';
import "./TicketItemComponent.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  const handleDownloadPDF = async () => {
    const ticketComponent = document.getElementById(`ticket-component-${ticket.id}`);
  
    try {
      const canvas = await html2canvas(ticketComponent);
      const imgData = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF();
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      // Establecer formato para el título
      pdf.setFontSize(20);  // Aumenta el tamaño del título
      pdf.setFont('bold');
      const title = "Ticket Confirmation";
      const titleWidth = pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const titleX = (pdf.internal.pageSize.width - titleWidth) / 2;  // Centra el título
      pdf.text(title, titleX, 20);
  
      // Agregar imagen con ajuste de tamaño
      pdf.addImage(imgData, 'PNG', 15, 30, imgWidth, imgHeight);
  
      // Contenido adicional
      pdf.setFontSize(13);
      pdf.text("Thank you for choosing our service.", 20, 135); // Ajusta la coordenada Y según tus necesidades
      pdf.text("Please arrive early to complete check-in procedures.", 20, 145);
      pdf.text("Remember not to consume food during the journey.", 20, 155);
      pdf.text("Your cooperation is appreciated. Have a safe journey!", 20, 165);

      // Precauciones antes del viaje
      pdf.text("Precautions before your journey:", 20, 185);
      pdf.text("- Arrive at least 30 minutes before departure for check-in.", 20, 195);
      pdf.text("- Avoid eating inside the train.", 20, 205);
      pdf.text("- Follow safety guidelines provided by our staff.", 20, 215);

      // Copiright y firma
      pdf.text("© 2023 Railway Transport Company. All rights reserved.", 20, 280);

      pdf.save(`ticket_${ticket.id}_${ticket.user.name}_${ticket.user.surname}.pdf`);
    } catch (error) {
      console.error('Error capturing ticket image:', error);
    }
  };
  
  return (
    <div className="main-2">
      <div className="mb-2 buttons-2"> 
        <div className="mr-2">
          <IconButton className='bg-danger' onClick={() => handleDeleteTicket(ticket.id)}>
            <DeleteIcon className="text-white"/>
          </IconButton>
        </div>
        <div className="ml-2">
          <IconButton className='bg-primary ml-2' onClick={handleDownloadPDF}>
            <ArrowCircleDownIcon className="text-white ml-2"></ArrowCircleDownIcon>
          </IconButton>
        </div>
      </div>
      <div id={`ticket-component-${ticket.id}`} className="col ticket-main-2">
        <div className='ticket-container-2'>
            <div className="row">
                <div className='col cell-2 header-2'>RAILWAY TRANSPORT COMPANY</div>
            </div>
            <div className="row">
            <div className="col cell-2">
              <div className='info-item-2'>Passenger</div>
              <div className='info-detail-2'>{ticket.user.name} {ticket.user.surname}</div>
            </div>
          </div>
            <div className="row">
                <div className="col cell-2">
                  <div className='info-item-2'>Departure</div>
                  <div className='info-detail-2'>{ticket.schedule.train.departureStation.name}</div>
                </div>
                <div className="col cell-2">
                  <div className='info-item-2'>Arrive</div>
                  <div className='info-detail-2'>{ticket.schedule.train.arrivalStation.name}</div>
                </div>
            </div>
            <div className="row">
              <div className="col cell">
                <div className='info-item'>Date</div>
                <div className='info-detail'>{ticket.schedule.departureTime.substring(0, 10)}</div>
              </div>
              <div className="col cell">
                <div className='info-item'>Time</div>
                <div className='info-detail'>{ticket.schedule.arrivalTime.substring(11, 16)}</div>
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
                  <div className='info-item-2'>Locator</div>
                  <div className='info-detail-2'>{ticket.id}</div>
                </div>
            </div>
        </div>
      </div>
            {/* Success and error dialog components */}

        <CustomizableDialog
            type='warning'
            open={isDeleteDialogOpen}
            title="Are you sure you want to cancel your ticket?"
            content="This action will permanently delete the selected ticket."
            agreeButtonLabel="Yes"
            cancelButtonLabel='No'
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
