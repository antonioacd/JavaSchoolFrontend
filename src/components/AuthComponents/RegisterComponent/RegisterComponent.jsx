import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import userService from '../../../services/UserService';
import CustomizableDialog from '../../Other/CustomizableDialog/CustomizableDialog';

function RegisterComponent() {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('error');

  const navigate = useNavigate();

  const changeEmailHandler = (event) => {
    setState({ ...state, email: event.target.value });
  };

  const changePasswordHandler = (event) => {
    setState({ ...state, password: event.target.value });
  };

  const openDialog = (type, message) => {
    setDialogType(type);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const register = (event) => {
    event.preventDefault();
    const error = checkState();

    if (error) {
      openDialog('error', error); // Open an error dialog
    } else {
      // Send the registration request to the backend
      userService.register(state.email, state.password)
        .then((response) => {
            console.log("data", response.data);
            navigate("/login");
            //localStorage.setItem('accessToken', accessToken);
            //console.log('accessToken: ', accessToken);
        })
        .catch((error) => {
          openDialog('error', 'Registration error'); // Open an error dialog
          console.log('Error: ', error);
        });
    }
  }

  function checkState() {
    if (
      state.email === '' ||
      state.password === ''
    ) {
      return 'Please fill in all fields';
    }

    return '';
  }

  const cancel = () => {
    navigate("/");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className="full-screen">
      <div className='container-custom'>
        <div className="row">
          <div className="col">
            <h1 className="text-center">Register</h1>

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
                  onClick={register}
                >
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
        title="Dialog Title"
        content={dialogMessage}
        agreeButtonLabel="OK"
        showCancelButton={false}
        onAgree={handleDialogClose}
      />
    </div>
  );
}

export default RegisterComponent;