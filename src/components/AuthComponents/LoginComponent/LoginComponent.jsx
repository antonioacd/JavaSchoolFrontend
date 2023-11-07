import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import userService from '../../../services/UserService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

function LoginComponent() {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('error');
  const [dialogTitle, setDialogTitle] = useState('');

  const navigate = useNavigate();

  const changeEmailHandler = (event) => {
    setState({ ...state, email: event.target.value });
  };

  const changePasswordHandler = (event) => {
    setState({ ...state, password: event.target.value });
  };

  const openDialog = (type, title, message) => {
    setDialogType(type);
    setDialogMessage(message);
    setDialogOpen(true);
    setDialogTitle(title)
  };

  const login = (event) => {
    event.preventDefault();
    const error = checkState();

    if (error) {
        openDialog('error', 'Login error', error); // Open an error dialog
    } else {
      // Send the login request to the backend
      userService.login(state.email, state.password)
        .then((response) => {
          const accessToken = response.data.accessToken;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('email', state.email);
          navigate("/");
        })
        .catch((error) => {
          openDialog('error', 'Login error', 'Check if the password and email are correct.'); // Open an error dialog
          console.log('Error: ', error);
        });
    }
  }

  function checkState() {
    if (state.email === '' || state.password === '') {
      return 'Please fill in all fields';
    }

    return '';
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="full-screen">
      <div className='container-custom'>
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
                />
              </div>
              <div className="row mt-4">
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  color="secondary"
                  value={state.password}
                  onChange={changePasswordHandler}
                />
              </div>
              <div className="row mt-4 justify-content-center">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={login}
                >
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
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={handleDialogClose}
      />
    </div>
  );
}

export default LoginComponent;
