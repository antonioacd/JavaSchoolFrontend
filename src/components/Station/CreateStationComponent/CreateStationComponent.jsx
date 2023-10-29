import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StationService from '../../../services/StationService';
import TextField from '@mui/material/TextField';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import './CreateStationComponent.css';

function CreateStationComponent() {
  const [state, setState] = useState({
    name: '',
    city: ''
  });

  const navigate = useNavigate();

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const changeNameHandler = (event) => {
    setState({ ...state, name: event.target.value });
  };

  const changeCityHandler = (event) => {
    setState({ ...state, city: event.target.value });
  };

  const saveStation = (event) => {
    event.preventDefault();

    const stationData = {
      name: state.name,
      city: state.city
    };

    if (checkState() === 1) {
      return;
    }

    StationService.createStation(stationData)
      .then(response => {
        if (response.status === 200) {
          setDialogMessage('Station added successfully');
          setSuccessDialogOpen(true);
        } else {
          setDialogMessage('Error adding station. Please try again.');
          setErrorDialogOpen(true);
        }
      })
      .catch(error => {
        setDialogMessage('Error adding station. Please try again.');
        setErrorDialogOpen(true);
      });
  };

  function checkState() {
    if (state.name === '' || state.city === '') {
      setDialogMessage('Please fill in all fields');
      setErrorDialogOpen(true);
      return 1;
    }
    return 0;
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h1 className='text-center'>Create station</h1>
      </div>

      <div className="card-body">
        <div className="row mt-4 justify-content-center">
          <div className="col">
            <TextField
              label="Station Name"
              variant="outlined"
              value={state.name}
              onChange={changeNameHandler}
              style={{ width: '100%' }}
            />
          </div>
          <div className="col">
            <TextField
              label="Station City"
              variant="outlined"
              value={state.city}
              onChange={changeCityHandler}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="row mt-4 justify-content-center">
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={saveStation}
          >
            Save station
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={()=>window.location.reload()}
          >
            Clear
          </button>
        </div>
      </div>

      <CustomizableDialog
        type='success'
        open={isSuccessDialogOpen}
        title="Success"
        content={dialogMessage}
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={() => {
          setSuccessDialogOpen(false);
          window.location.reload();
        }}
      />
      <CustomizableDialog
        type='error'
        open={isErrorDialogOpen}
        title="Error"
        content={dialogMessage}
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={() => setErrorDialogOpen(false)}
      />
    </div>
  );
}

export default CreateStationComponent;
