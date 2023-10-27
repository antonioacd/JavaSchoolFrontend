import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import trainService from '../../../services/TrainService';

function ViewTrainsComponent() {

  const [data, setData] = useState([]);

  useEffect(() => {
    
    const trains = [];

    trainService.getTrains().then((res) => {
      console.log(res.data);
        setData(res.data);

        const trainsInfo = res.data;

        trainsInfo.forEach(trainInfo => {
          const train = {
            id: trainInfo.id,
            departureStation: trainInfo.departureStation.name,
            arrivalStation: trainInfo.arrivalStation.name,
            trainNumber: trainInfo.trainNumber,
            trainSeats: trainInfo.seats
          }

          trains.push(train);

        });

        setData(trains);
  });

  }, []);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'departureStation', numeric: false, disablePadding: false, label: 'Departure Station' },
    { id: 'arrivalStation', numeric: false, disablePadding: false, label: 'Arrival Station' },
    { id: 'trainNumber', numeric: false, disablePadding: false, label: 'Train Number' },
    { id: 'trainSeats', numeric: false, disablePadding: false, label: 'Train Seats' },
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
