import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../../services/TicketService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

function ViewTicketsComponent({ initialData, isMainPage }) {
  const [data, setData] = useState(initialData);
  const [main, setMain] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    setMain(isMainPage);
  }, []);

  useEffect(() => {
    if (!main) {
      setData(dataToTickets(initialData));
      return;
    }
    fetchTicketData();
  }, [initialData]);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'surname', numeric: false, disablePadding: false, label: 'Surname' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'seatNumber', numeric: false, disablePadding: false, label: 'Seat Number' },
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const fetchTicketData = () => {
    ticketService.getTickets()
      .then((res) => {
        const ticketsInfo = res.data;
        setData(dataToTickets(ticketsInfo));
      })
      .catch(() => {
        setErrorDialogMessage('An error occurred');
        setErrorDialogOpen(true);
        setDeleteDialogOpen(false);
      });
  };

  function dataToTickets(ticketsInfo){
    const tickets = ticketsInfo.map((ticketInfo) => ({
      id: ticketInfo.id,
      name: ticketInfo.user.name,
      surname: ticketInfo.user.surname,
      email: ticketInfo.user.email,
      seatNumber: ticketInfo.seatNumber
    }));
    return tickets;
  }

  const handleAddRecord = () => {
    navigate('/ticket/create');
  };

  const handleDeleteRecords = (selectedIds) => {
    setSelectedIds(selectedIds);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const failedDeletions = [];

    Promise.all(selectedIds.map((id) => ticketService.deleteTicket(id)))
      .then((responses) => {
        responses.forEach((response, index) => {
          if (response.status !== 200) {
            failedDeletions.push(selectedIds[index]);
          }
        });

        if (failedDeletions.length === 0) {
          const newData = data.filter((item) => !selectedIds.includes(item.id));
          setData(newData);
          setDeleteDialogOpen(false);
        } else {
          setErrorDialogMessage('Unable to delete the selected records. They may be in use.');
          setErrorDialogOpen(true);
          setDeleteDialogOpen(false);
        }
      })
      .catch(() => {
        setErrorDialogMessage('An error occurred while deleting the records.');
        setErrorDialogOpen(true);
        setDeleteDialogOpen(false);
      });
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleDismissError = () => {
    setErrorDialogOpen(false);
    fetchTicketData();
  };

  return (
    <div>
      <EnhancedTableComponent
        data={data}
        title="Tickets"
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
      />
      <CustomizableDialog
        type="warning"
        open={isDeleteDialogOpen}
        title="Are you sure you want to delete the selected records?"
        content="This action will permanently delete the selected records."
        agreeButtonLabel="Yes, delete"
        cancelButtonLabel="Cancel"
        showCancelButton={true}
        onCancel={handleCancelDelete}
        onAgree={handleConfirmDelete}
      />
      <CustomizableDialog
        type="error"
        open={isErrorDialogOpen}
        title="Error"
        content={errorDialogMessage}
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={handleDismissError}
      />
    </div>
  );
}

export default ViewTicketsComponent;
