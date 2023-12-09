import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import stationService from '../../../services/StationService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

/**
 * Component for viewing and managing station records.
 */
function ViewStationsComponent() {
  const [data, setData] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  const navigate = useNavigate();

  // Define the columns for the table.
  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'city', numeric: false, disablePadding: false, label: 'City' },
    { id: 'view', numeric: false, disablePadding: false, label: 'Details' }
  ];

  const rowsPerPageOptions = [5, 10, 25];

  /**
   * Handler for adding a new station record.
   */
  const handleAddRecord = () => {
    navigate('/station/create');
  };

  /**
   * Handler for deleting selected station records.
   * @param {Array} selectedIds - An array of selected station IDs to delete.
   */
  const handleDeleteRecords = (selectedIds) => {
    setSelectedIds(selectedIds);
    setDeleteDialogOpen(true);
  };

  /**
   * Handler for confirming the deletion of selected station records.
   */
  const handleConfirmDelete = async () => {
    const failedDeletions = [];

    try {
      for (const id of selectedIds) {
        const response = await stationService.deleteStation(id);

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

  /**
   * Handler for canceling the delete confirmation dialog.
   */
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  /**
   * Handler for dismissing the error dialog.
   */
  const handleDismissError = () => {
    setErrorDialogOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const stations = [];

    // Fetch stations and populate the data.
    stationService.getStations()
      .then(res => {
        setData(res.data);

        const stationsInfo = res.data;

        stationsInfo.forEach(stationInfo => {
          const station = {
            id: stationInfo.id,
            name: stationInfo.name,
            city: stationInfo.city,
          };

          stations.push(station);
        });

        setData(stations);
      })
      .catch(error => {
        console.error('Error fetching stations:', error);
      });
  }, []);

  /**
   * Handler for viewing details of a station record.
   * @param {string} id - The ID of the station to view details.
   */
  const handleDetailsRecords = (id) => {
    navigate(`/station/details/${id}`);
  };

  return (
    <div>
      <div className="full-screen">
        <EnhancedTableComponent
          data={data}
          title="Stations"
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
          title="Error"
          content={errorDialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={handleDismissError}
        />
      </div>
    </div>
  );
}

export default ViewStationsComponent;
