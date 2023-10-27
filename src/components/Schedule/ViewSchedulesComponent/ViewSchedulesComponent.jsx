import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import scheduleService from '../../../services/ScheduleService';

function ViewSchedulesComponent() {

  const [data, setData] = useState([]);

  useEffect(() => {
    
    const schedules = [];

    scheduleService.getSchedules().then((res) => {
      console.log(res.data);
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
