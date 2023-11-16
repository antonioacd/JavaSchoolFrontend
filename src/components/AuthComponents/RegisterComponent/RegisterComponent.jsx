import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import userService from '../../../services/UserService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';
import PasswordMeterInput from '../../PasswordMeterInputComponent/PasswordMeterInput';
import validator from 'validator';

function RegisterComponent() {
  const [state, setState] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('error');

  const navigate = useNavigate();

  const changeNameHandler = (event) => {
    const name = event.target.value;
    setState((prev) => ({ ...prev, name }));
    validateName(name);
  };

  const changeSurnameHandler = (event) => {
    const surname = event.target.value;
    setState((prev) => ({ ...prev, surname }));
    validateSurname(surname);
  };

  const changeEmailHandler = (event) => {
    const email = event.target.value;
    setState((prev) => ({ ...prev, email }));
    validateEmail(email);
  };

  const changePasswordHandler = (event) => {
    const password = event.target.value;
    setState((prev) => ({ ...prev, password }));
    validatePassword(password);
  };

  const openDialog = (type, message) => {
    setDialogType(type);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const register = (event) => {
    event.preventDefault();

    const passwordError = validatePassword(state.password);

    if (checkState() === 1 || passwordError) {
      return;
    }

    userService
      .register(state.name, state.surname, state.email, state.password)
      .then((response) => {
        console.log('data', response.data);
        openDialog('success', 'Registration succesfully');
        navigate('/login');
      })
      .catch((error) => {
        openDialog('error', 'Registration error');
      });
  };

  function checkState() {
    if (
      validator.isEmpty(state.name) ||
      validator.isEmpty(state.surname) ||
      validator.isEmpty(state.email) ||
      validator.isEmpty(state.password) ||
      !validator.isEmail(state.email) ||
      !validator.isStrongPassword(state.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 0, minSymbols: 1 })
    ) {
      validateEmail(state.email);
      validateName(state.name);
      validateSurname(state.surname);
      validatePassword(state.password);
      return 1;
    }

    return 0;
  }

  const validateName = (name) => {
    const errorMessage = validator.isEmpty(name) ? 'Name is required' : '';
    setErrors((prev) => ({ ...prev, name: errorMessage }));
  };

  const validateSurname = (surname) => {
    const errorMessage = validator.isEmpty(surname) ? 'Surname is required' : '';
    setErrors((prev) => ({ ...prev, surname: errorMessage }));
  };

  const validateEmail = (email) => {
    const errorMessage = validator.isEmpty(email) ? 'Email is required' : !validator.isEmail(email) ? 'Invalid email format' : '';
    setErrors((prev) => ({ ...prev, email: errorMessage }));
  };

  const validatePassword = (password) => {
    const errorMessage = validator.isEmpty(password) ? 'Password is required' : password.length < 8 ? 'Password must be at least 8 characters long' : !validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 0, minSymbols: 1 }) ? 'Password must contain at least 1 uppercase letter and 1 special character' : '';
    setErrors((prev) => ({ ...prev, password: errorMessage }));
  };

  const cancel = () => {
    navigate('/');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="full-screen">
      <div className="container-custom">
        <div className="row">
          <div className="col">
            <h1 className="text-center">Register</h1>

            <div>
              <div className="row mt-4">
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  color="secondary"
                  value={state.name}
                  onChange={changeNameHandler}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </div>
              <div className="row mt-4">
                <TextField
                  id="outlined-basic"
                  label="Surname"
                  variant="outlined"
                  color="secondary"
                  value={state.surname}
                  onChange={changeSurnameHandler}
                  error={!!errors.surname}
                  helperText={errors.surname}
                />
              </div>
              <div className="row mt-4">
                <TextField
                  id="outlined-basic"
                  type="email"
                  label="Email"
                  variant="outlined"
                  color="secondary"
                  value={state.email}
                  onChange={changeEmailHandler}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>
              <div className="row mt-4">
                <PasswordMeterInput
                  value={state.password}
                  onChange={changePasswordHandler}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </div>
              <div className="row mt-4 justify-content-center">
                <Button type="button" variant="contained" color="primary" onClick={register}>
                  Register
                </Button>
                <div className="mt-2">
                  If you have an account, <Link to="/login">login</Link>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomizableDialog
        type={dialogType}
        open={dialogOpen}
        title="Registration error"
        content={dialogMessage}
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={handleDialogClose}
      />
    </div>
  );
}

export default RegisterComponent;
