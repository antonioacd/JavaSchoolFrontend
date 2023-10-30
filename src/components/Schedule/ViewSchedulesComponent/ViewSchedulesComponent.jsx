import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import scheduleService from '../../../services/ScheduleService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

function ViewSchedulesComponent() {
  const [data, setData] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  useEffect(() => {
    const schedules = [];

    scheduleService.getSchedules().then((res) => {
      setData(res.data);

      const schedulesInfo = res.data;

      schedulesInfo.forEach(scheduleInfo => {
        // Convertir las fechas a objetos Date
        const departureDate = new Date(scheduleInfo.departureTime);
        const arrivalDate = new Date(scheduleInfo.arrivalTime);

        // Obtener la parte de la fecha y la hora (solo hora y minutos) como cadenas
        const departureDateTimeString = `${departureDate.toLocaleDateString()} ${departureDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        const arrivalDateTimeString = `${arrivalDate.toLocaleDateString()} ${arrivalDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

        const schedule = {
          id: scheduleInfo.id,
          departureTime: departureDateTimeString,
          arrivalTime: arrivalDateTimeString,
          trainNumber: scheduleInfo.train.trainNumber,
          occupiedSeats: scheduleInfo.occupiedSeats,
        };

        schedules.push(schedule);
      });

      setData(schedules);
    });
  }, []);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'departureTime', numeric: false, disablePadding: false, label: 'Departure Time' },
    { id: 'arrivalTime', numeric: false, disablePadding: false, label: 'Arrival Time' },
    { id: 'trainNumber', numeric: false, disablePadding: false, label: 'Train Number' },
    { id: 'occupiedSeats', numeric: false, disablePadding: false, label: 'Occupied Seats' },
    { id: 'view', numeric: false, disablePadding: false, label: 'Details' }
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate('/schedule/create');
  };

  const handleDeleteRecords = (selectedIds) => {
    setSelectedIds(selectedIds);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const failedDeletions = [];

    try {
      for (const id of selectedIds) {
        const response = await scheduleService.deleteSchedule(id);

        if (response.status !== 200) {
          failedDeletions.push(id);
        }
      }

      if (failedDeletions.length === 0) {
        const newData = data.filter(item => !selectedIds.includes(item.id));
        setData(newData);
        setDeleteDialogOpen(false);
        window.location.reload();
      } else {
        setErrorDialogMessage('Unable to delete the selected records. They may be in use.');
        setErrorDialogOpen(true);
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      setErrorDialogMessage('An error occurred while deleting the records.');
      setErrorDialogOpen(true);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleDismissError = () => {
    setErrorDialogOpen(false);
    window.location.reload();
  };

  const handleDetailsRecords = (id) => {
    console.log('Showing details for schedule with ID:', id);
    // Aquí puedes navegar a la nueva clase y pasar el ID como parte de la URL
    navigate(`/schedule/details/${id}`);
  };


  return (
    <div>
      <EnhancedTableComponent
        data={data}
        title='Schedules'
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
        onViewRecord={handleDetailsRecords}
      />

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
        type='error'
        open={isErrorDialogOpen}
        title="Deletion Error"
        content={errorDialogMessage}
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={handleDismissError}
      />
    </div>
  );
}

export default ViewSchedulesComponent;
