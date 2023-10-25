import React, { useState } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';

function ViewTrainsComponent() {
  // Datos de ejemplo
  const initialData = [
    { id: 1, seats: 100, station: 'Station A'},
    { id: 1, seats: 200, station: 'Station B'},
    { id: 1, seats: 150, station: 'Station C'},
  ];

  const [data, setData] = useState(initialData);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'seats', numeric: false, disablePadding: false, label: 'Seats' },
    { id: 'station', numeric: false, disablePadding: false, label: 'Station' },
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate("/train/create");
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
        title="Trains"
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
      />
    </div>
  );
}

export default ViewTrainsComponent;
