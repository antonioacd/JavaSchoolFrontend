import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import userService from '../../../services/UserService';
import validator from 'validator';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

function LoginComponent() {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('error');
  const [dialogTitle, setDialogTitle] = useState('');

  const navigate = useNavigate();

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

  const validateEmail = (email) => {
    const errorMessage = validator.isEmpty(email) ? 'Email is required' : !validator.isEmail(email) ? 'Invalid email format' : '';
    setErrors((prev) => ({ ...prev, email: errorMessage }));
  };

  const validatePassword = (password) => {
    const errorMessage = validator.isEmpty(password) ? 'Password is required' : '';
    setErrors((prev) => ({ ...prev, password: errorMessage }));
  };

  const openDialog = (type, title, message) => {
    setDialogType(type);
    setDialogMessage(message);
    setDialogOpen(true);
    setDialogTitle(title);
  };

  const login = (event) => {
    event.preventDefault();
    const error = checkState();

    if (error) {
      openDialog('error', 'Login error', error);
    } else {
      userService
        .login(state.email, state.password)
        .then((response) => {
          const accessToken = response.data.accessToken;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('email', state.email);
          navigate('/');
        })
        .catch((error) => {
          openDialog('error', 'Login error', 'Check if the password and email are correct.');
          console.log('Error: ', error);
        });
    }
  };

  function checkState() {
    if (validator.isEmpty(state.email) || validator.isEmpty(state.password)) {
      return 'Please fill in all fields';
    }

    return '';
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="full-screen">
      <div className="container-custom">
        <div className="row">
          <div className="col">
            <h1 className="text-center">Login</h1>

            <div>
              <div className="row mt-4">
                <TextField
                  id="outlined-basic"
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
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  type="password"
                  color="secondary"
                  value={state.password}
                  onChange={changePasswordHandler}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </div>
              <div className="row mt-4 justify-content-center">
                <Button type="button" variant="contained" color="primary" onClick={login}>
                  Login
                </Button>
              </div>
              <div className="mt-2">
                If you don't have an account yet, <Link to="/register">create a new one</Link>.
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomizableDialog
        type={dialogType}
        open={dialogOpen}
        title={dialogTitle}
        content={dialogMessage}
        agreeButtonLabel="Accept"
        showCancelButton={false}
        onAgree={handleDialogClose}
      />
    </div>
  );
}

export default LoginComponent;
