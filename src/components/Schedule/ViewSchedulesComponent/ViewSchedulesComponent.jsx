import React, { useState } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';

function ViewSchedulesComponent() {
  // Datos de ejemplo
  const initialData = [
    {
        id: 1,
        departureTime: "2023-10-24T10:30:00.000+00:00",
        arrivalTime: "2023-10-24T14:30:00.000+00:00",
        occupiedSeats: "0",
        departureStation: "Station A",
        arrivalStation: "Station B",
        trainSeats: 100,
      },
      {
        id: 2,
        departureTime: "2023-10-24T11:30:00.000+00:00",
        arrivalTime: "2023-10-24T15:30:00.000+00:00",
        occupiedSeats: "50",
        departureStation: "Station B",
        arrivalStation: "Station C",
        trainSeats: 200,
      },
      {
        id: 3,
        departureTime: "2023-10-24T12:30:00.000+00:00",
        arrivalTime: "2023-10-24T16:30:00.000+00:00",
        occupiedSeats: "100",
        departureStation: "Station C",
        arrivalStation: "Station D",
        trainSeats: 150,
      },
    ];

  const [data, setData] = useState(initialData);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'departureTime', numeric: false, disablePadding: false, label: 'Departure Time' },
    { id: 'arrivalTime', numeric: false, disablePadding: false, label: 'Arrival Time' },
    { id: 'occupiedSeats', numeric: false, disablePadding: false, label: 'Occupied Seats' },
    { id: 'departureStation', numeric: false, disablePadding: false, label: 'Departure Station' },
    { id: 'arrivalStation', numeric: false, disablePadding: false, label: 'Arrival Station' },
    { id: 'trainSeats', numeric: false, disablePadding: false, label: 'Train Seats' },
  ];
  

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate("/schedule/create");
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
        title="Schedules"
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
      />
    </div>
  );
}

export default ViewSchedulesComponent;
