import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import userService from '../../../services/UserService';
import SnackbarComponent from '../../Other/SnackbarComponent/SnackbarComponent';

function LoginComponent() {
    const [state, setState] = useState({
        email: '',
        password: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');

    const navigate = useNavigate();

    const changeEmailHandler = (event) => {
        setState({ ...state, email: event.target.value });
    };

    const changePaswordHandler = (event) => {
        setState({ ...state, password: event.target.value });
    };

    const login = (event) => {
        
        event.preventDefault();
        const error = checkState();

        if (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(error);
            setSnackbarOpen(true);
        } else {
            // Enviar la solicitud de inicio de sesión al backend
            userService.login(state.email, state.password)
                .then((response) => {
                    const token = response.data.token;
                    localStorage.setItem('token', token)
                    console.log('Token: ',token);

                }).catch((error) => {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Error de inicio de sesión');
                    setSnackbarOpen(true);
                    console.log('Error: ',error);
                });
        }
    }

    function checkState() {
        if (
        state.email === '' ||
        state.password === ''
        ) {
        return 'Debe rellenar todos los campos';
        }

        return '';
    }

    const cancel = () => {
        navigate("/");
    }; 

const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                        onChange={changePaswordHandler}
                    />
                    </div>
                <div className="row mt-4 justify-content-center">
                    <button
                    type="button"
                    className="btn btn-primary"
                    onClick={login}
                    >
                    Login
                    </button>
                
                </div>
                <div className="mt-2">
                    If you don't have an account yet, <Link to="/register">create a new one</Link>.
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
};

export default LoginComponent;
