import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stationService from '../../../services/StationService';
import TextField from '@mui/material/TextField';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import validator from 'validator';

/**
 * Component for creating a new station.
 */
function CreateStationComponent() {
  const [state, setState] = useState({
    name: '',
    city: '',
  });

  const navigate = useNavigate();

  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    city: '',
  });

  /**
   * Handle input change for the station name.
   * @param {Object} event - The input change event.
   */
  const changeNameHandler = (event) => {
    const name = event.target.value;
    setState((prev) => ({ ...prev, name }));
    validateName(name);
  };

  /**
   * Handle input change for the station city.
   * @param {Object} event - The input change event.
   */
  const changeCityHandler = (event) => {
    const city = event.target.value;
    setState((prev) => ({ ...prev, city }));
    validateCity(city);
  };

  /**
   * Save the station data and handle the result.
   * @param {Object} event - The form submission event.
   */
  const saveStation = (event) => {
    event.preventDefault();

    const stationData = {
      name: state.name,
      city: state.city,
    };

    if (checkState() === 1) {
      return;
    }

    stationService.createStation(stationData)
      .then((response) => {
        if (response.status === 200) {
          setDialogMessage('Station added successfully');
          setSuccessDialogOpen(true);
        } else {
          setDialogMessage('Error adding station. Please try again.');
          setErrorDialogOpen(true);
        }
      })
      .catch((error) => {
        setDialogMessage('Error adding station. Please try again.');
        setErrorDialogOpen(true);
      });
  };

  /**
   * Check if the state has missing or empty fields.
   * @returns {number} - 0 if valid, 1 if missing fields.
   */
  function checkState() {
    if (validator.isEmpty(state.name) || validator.isEmpty(state.city)) {
      validateName(state.name);
      validateCity(state.city);
      return 1;
    }
    return 0;
  }

  const validateName = (name) => {
    setErrors((prev) => ({ ...prev, name: validator.isEmpty(name) ? 'Station Name is required' : '' }));
  };

  const validateCity = (city) => {
    setErrors((prev) => ({ ...prev, city: validator.isEmpty(city) ? 'Station City is required' : '' }));
  };

  return (
    <div className="full-screen">
      <div className="container-custom">
        <div className="row justify-content-center">
          <h1 className="text-center">Create Station</h1>
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
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>
            <div className="col">
              <TextField
                label="Station City"
                variant="outlined"
                value={state.city}
                onChange={changeCityHandler}
                style={{ width: '100%' }}
                error={!!errors.city}
                helperText={errors.city}
              />
            </div>
          </div>

          <div className="row mt-4 justify-content-center">
            <button type="button" className="btn btn-primary mt-2" onClick={saveStation}>
              Save station
            </button>
            <button type="button" className="btn btn-secondary mt-2" onClick={() => window.location.reload()}>
              Clear
            </button>
          </div>
        </div>

        <CustomizableDialog
          type="success"
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
          type="error"
          open={isErrorDialogOpen}
          title="Error"
          content={dialogMessage}
          agreeButtonLabel="OK"
          showCancelButton={false}
          onAgree={() => setErrorDialogOpen(false)}
        />
      </div>
    </div>
  );
}

export default CreateStationComponent;
