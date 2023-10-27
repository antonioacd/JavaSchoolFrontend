import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import userService from '../../../services/UserService';

function ViewUsersComponent() {

  const [data, setData] = useState([]);

  useEffect(() => {
    
    const users = [];

    userService.getUsers().then((res) => {
      console.log(res.data);
        setData(res.data);

        const usersInfo = res.data;

        usersInfo.forEach(userInfo => {
          const user = {
            id: userInfo.id,
            name: userInfo.name,
            surname: userInfo.surname,
            email: userInfo.email,
            rol: userInfo.rol.rol
          }

          users.push(user);

        });

        setData(users);
  });

  }, []);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'surname', numeric: false, disablePadding: false, label: 'Surname' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'rol', numeric: false, disablePadding: false, label: 'Rol' },
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate("/user/create");
  };

  const handleDeleteRecords = (selectedIds) => {
    // Lógica para eliminar registros seleccionados
    const newData = data.filter((item) => !selectedIds.includes(item.id));
    setData(newData);
  };

  return (
    <div>
      <EnhancedTableComponent
        data={data}
        title="Users"
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
      />
    </div>
  );
}

export default ViewUsersComponent;
