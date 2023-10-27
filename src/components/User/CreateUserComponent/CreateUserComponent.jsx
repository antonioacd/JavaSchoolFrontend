import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import userService from '../../../services/UserService';
import SnackbarComponent from '../../Other/SnackbarComponent/SnackbarComponent';

function CreateUserComponent() {
  const [state, setState] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    dateOfBirth: '',
    rol: { id: 1 },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const navigate = useNavigate();

  const changeNameHandler = (event) => {
    setState({ ...state, name: event.target.value });
  };

  const changeSurnameHandler = (event) => {
    setState({ ...state, surname: event.target.value });
  };

  const changeEmailHandler = (event) => {
    setState({ ...state, email: event.target.value });
  };

  const changePaswordHandler = (event) => {
    setState({ ...state, password: event.target.value });
  };

  const changeDateOfBirthHandler = (newDate) => {
    setState({ ...state, dateOfBirth: newDate });
  };

  const cancel = () => {
    navigate('/');
  };

  const saveUser = (event) => {
    event.preventDefault();

    const error = checkState();

    if (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    } else {
      userService
        .createUser(state)
        .then((response) => {
          if (response.status === 200) {
            setSnackbarSeverity('success');
            setSnackbarMessage('Realizado');
            setSnackbarOpen(true);
          } else {
            setSnackbarSeverity('error');
            setSnackbarMessage('Algo salió mal');
            setSnackbarOpen(true);
          }
        })
        .catch((error) => {
          setSnackbarSeverity('error');
          setSnackbarMessage('Error en la solicitud');
          setSnackbarOpen(true);
        });
    }
  };

  function checkState() {
    if (
      state.name === '' ||
      state.surname === '' ||
      state.email === '' ||
      state.password === '' ||
      state.dateOfBirth === ''
    ) {
      return 'Debe rellenar todos los campos';
    }

    return '';
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="mt-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="text-center">Registro</h1>

            <div>
              <div className="row">
                <div className="col mt-2">
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    color="secondary"
                    value={state.name}
                    onChange={changeNameHandler}
                  />
                </div>
                <div className="col mt-2">
                  <TextField
                    id="outlined-basic"
                    label="Surname"
                    variant="outlined"
                    color="secondary"
                    value={state.surname}
                    onChange={changeSurnameHandler}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    color="secondary"
                    value={state.email}
                    onChange={changeEmailHandler}
                  />
                </div>
                <div className="col mt-4">
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    color="secondary"
                    value={state.password}
                    onChange={changePaswordHandler}
                  />
                </div>
              </div>
                <div className="row mt-4">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of birthday"
                      value={state.dateOfBirth}
                      onChange={changeDateOfBirthHandler}
                    />
                  </LocalizationProvider>
                </div>
              <div className="row mt-4 justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveUser}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={cancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SnackbarComponent
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
}

export default CreateUserComponent;
