import React, { useState, useEffect } from 'react';
import EnhancedTableComponent from '../../Other/TableComponent/EnhancedTableComponent';
import { useNavigate } from 'react-router-dom';
import stationService from '../../../services/StationService';

function ViewStationsComponent() {

  const [data, setData] = useState([]);

  useEffect(() => {
    
    const stations = [];

    stationService.getStations().then((res) => {
      console.log(res.data);
        setData(res.data);

        const stationsInfo = res.data;

        stationsInfo.forEach(stationInfo => {
          const station = {
            id: stationInfo.id,
            name: stationInfo.name,
            city: stationInfo.city
          }

          stations.push(station);

        });

        setData(stations);
  });

  }, []);

  const navigate = useNavigate();

  const columns = [
    { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'city', numeric: false, disablePadding: false, label: 'City' },
  ];

  const rowsPerPageOptions = [5, 10, 25];

  const handleAddRecord = () => {
    navigate("/station/create");
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
        title="Stations"
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        onAddRecord={handleAddRecord}
        onDeleteRecords={handleDeleteRecords}
      />
    </div>
  );
}

export default ViewStationsComponent;
