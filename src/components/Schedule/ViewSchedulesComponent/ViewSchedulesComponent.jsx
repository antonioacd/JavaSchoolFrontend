import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import scheduleService from '../../../services/ScheduleService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import ScheduleFilterDialogComponent from '../../Other/DialogsComponent/ScheduleFilterDialogComponent/ScheduleFilterDialogComponent';

function ViewSchedulesComponent() {
  const [data, setData] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);
  const [allSchedules, setAllSchedules] = useState([]);

  useEffect(() => {
    const schedules = [];

    scheduleService.getSchedules().then((res) => {
      setData(res.data);

      const schedulesInfo = res.data;

      setAllSchedules(schedulesInfo);

      setData(convertDataToSchedules(schedulesInfo));
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

  const handleApplyFilter = (train) => {
    setSelectedTrain(train);

      scheduleService.getschedulesByTrainNumber(train.trainNumber)
        .then((res) => {
          const filteredSchedules = res.data;

          if (filteredSchedules.length === 0) {
            setErrorDialogMessage('No results');
            setErrorDialogOpen(true);
          } else {
            setData(convertDataToSchedules(filteredSchedules));
            setFilterApplied(true);
          }
        })
        .catch((error) => {
          console.log('Error al buscar', error);
        });

    setFilterDialogOpen(false);

    

  };

  function convertDataToSchedules(data) {
    const schedules = [];
    const schedulesInfo = data;

    schedulesInfo.forEach((scheduleInfo) => {

      const departureDate = scheduleInfo.departureTime.substring(0, 10) + "    " + scheduleInfo.departureTime.substring(11, 19);
      const arrivalDate = scheduleInfo.arrivalTime.substring(0, 10) + "    " + scheduleInfo.arrivalTime.substring(11, 19);

      const schedule = {
        id: scheduleInfo.id,
        departureTime: departureDate,
        arrivalTime: arrivalDate,
        trainNumber: scheduleInfo.train.trainNumber,
        occupiedSeats: scheduleInfo.occupiedSeats,
      };

      schedules.push(schedule);
    });

    return schedules;
  }

  const handleFilter = () => {

    if(filterApplied){
      setFilterApplied(false);
      setData(convertDataToSchedules(allSchedules));
    }else{
      setFilterDialogOpen(true);
    }

  };

  return (
    <div>
      <div className="full-screen">
          <EnhancedTableComponent
            data={data}
            title='Schedules'
            columns={columns}
            rowsPerPageOptions={rowsPerPageOptions}
            onAddRecord={handleAddRecord}
            onDeleteRecords={handleDeleteRecords}
            onViewRecord={handleDetailsRecords}
            onFilterClick={handleFilter}
            isFilterApplied={filterApplied}
          />
      </div>

        <ScheduleFilterDialogComponent
          title="Schedule filters"
          open={isFilterDialogOpen}
          onAgree={handleApplyFilter}
          onCancel={() => setFilterDialogOpen(false)}
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
