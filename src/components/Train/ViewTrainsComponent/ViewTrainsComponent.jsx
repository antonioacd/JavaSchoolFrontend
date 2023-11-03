import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import trainService from '../../../services/TrainService';
import dayjs from 'dayjs';
import TrainFilterDialogComponent from '../../Other/DialogsComponent/TrainFilterDialogComponent/TrainFilterDialogComponent';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import stationService from '../../../services/StationService';

function ViewTrainsComponent() {
  const [data, setData] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    departureStation: null,
    arrivalStation: null,
  });
  const [selectedDepartureStation, setSelectedDepartureStation] = useState(null);
  const [selectedArrivalStation, setSelectedArrivalStation] = useState(null);

  useEffect(() => {
    trainService.getTrains().then((res) => {
      setData(convertDataToTrains(res.data));
    });
  }, []);

  function convertDataToTrains(data) {
    const trains = [];
    const trainsInfo = data;

    trainsInfo.forEach((trainInfo) => {
      const train = {
        id: trainInfo.id,
        departureStation: trainInfo.departureStation.name,
        arrivalStation: trainInfo.arrivalStation.name,
        trainNumber: trainInfo.trainNumber,
        trainSeats: trainInfo.seats,
        duration: formatDuration(trainInfo.duration),
      };

      trains.push(train);
    });

    return trains;
  }

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
    { id: 'view', numeric: false, disablePadding: false, label: 'Details' },
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate('/train/create');
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
        const newData = data.filter((item) => !selectedIds.includes(item.id));
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
    navigate(`/train/details/${id}`);
  };

  const handleFilter = () => {
    setFilterDialogOpen(true);
  };

  const handleApplyFilter = (departureStation, arrivalStation) => {
    setSelectedDepartureStation(departureStation);
    setSelectedArrivalStation(arrivalStation);

    console.log("stations: ", departureStation);

    if (departureStation && arrivalStation) {
      trainService
        .getTrainsWithDepartureStationAndArrivalStation(departureStation.name, arrivalStation.name)
        .then((res) => {
          const filteredSchedules = res.data;

          if (filteredSchedules.length === 0) {
            setErrorDialogMessage('No results');
            setErrorDialogOpen(true);
          } else {
            setData(convertDataToTrains(filteredSchedules));
          }
        })
        .catch((error) => {
          console.log('Error al buscar', error);
        });
    }

    setFilterDialogOpen(false);
  };

  return (
    <div>
      <div className="full-screen">
        <EnhancedTableComponent
          data={data}
          title="Trains"
          columns={columns}
          rowsPerPageOptions={rowsPerPageOptions}
          onAddRecord={handleAddRecord}
          onDeleteRecords={handleDeleteRecords}
          onViewRecord={handleDetailsRecords}
          onFilterClick={handleFilter}
        />
      </div>

      <TrainFilterDialogComponent
        title="Train filters"
        open={isFilterDialogOpen}
        onAgree={handleApplyFilter}
        onCancel={() => setFilterDialogOpen(false)}
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
