import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import trainService from '../../../services/TrainService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import dayjs from 'dayjs';

function ViewTrainsComponent() {
  const [data, setData] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  useEffect(() => {
    const trains = [];

    trainService.getTrains().then((res) => {
      setData(res.data);

      const trainsInfo = res.data;

      trainsInfo.forEach(trainInfo => {


        const train = {
          id: trainInfo.id,
          departureStation: trainInfo.departureStation.name,
          arrivalStation: trainInfo.arrivalStation.name,
          trainNumber: trainInfo.trainNumber,
          trainSeats: trainInfo.seats,
          duration: formatDuration(trainInfo.duration)
        }

        trains.push(train);
      });

      setData(trains);
    });
  }, []);

  function formatDuration(durationString) {
    const duration = dayjs.duration(durationString);
    return `${duration.hours()} hours, ${duration.minutes()} mins`;
  }

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'departureStation', numeric: false, disablePadding: false, label: 'Departure Station' },
    { id: 'arrivalStation', numeric: false, disablePadding: false, label: 'Arrival Station' },
    { id: 'trainNumber', numeric: false, disablePadding: false, label: 'Train Number' },
    { id: 'trainSeats', numeric: false, disablePadding: false, label: 'Train Seats' },
    { id: 'duration', numeric: false, disablePadding: false, label: 'Duration' },
    { id: 'view', numeric: false, disablePadding: false, label: 'Details' }
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate("/train/create");
  };

  const handleDeleteRecords = (selectedIds) => {
    setSelectedIds(selectedIds);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const failedDeletions = [];

    try {
      for (const id of selectedIds) {
        const response = await trainService.deleteTrain(id);

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
    // Aquí puedes navegar a la nueva clase y pasar el ID como parte de la URL
    navigate(`/train/details/${id}`);
  };

  return (
    <div>
      <EnhancedTableComponent
        data={data}
        title="Trains"
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

export default ViewTrainsComponent;