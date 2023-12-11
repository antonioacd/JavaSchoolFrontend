import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import userService from '../../../services/UserService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

function ViewUsersComponent() {
  const [data, setData] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'surname', numeric: false, disablePadding: false, label: 'Surname' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const fetchUserData = () => {
    userService.getUsers()
    .then((res) => {
      const usersInfo = res.data;
      const users = usersInfo.map((userInfo) => ({
        id: userInfo.id,
        name: userInfo.name,
        surname: userInfo.surname,
        email: userInfo.email,
      }));
      setData(users);
    })
    .catch(() => {
      setErrorDialogMessage('An error occurred');
      setErrorDialogOpen(true);
      setDeleteDialogOpen(false);
    });
  };

  const handleAddRecord = () => {
  };

  const handleDeleteRecords = (selectedIds) => {
    setSelectedIds(selectedIds);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const failedDeletions = [];

    Promise.all(selectedIds.map((id) => userService.deleteUser(id)))
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
    fetchUserData();
  };

  const handleDetailsRecords = () => {
  };

  return (
    <div className="full-screen">
      <EnhancedTableComponent
        data={data}
        title="Users"
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
        onViewRecord={handleDetailsRecords}
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

export default ViewUsersComponent;
