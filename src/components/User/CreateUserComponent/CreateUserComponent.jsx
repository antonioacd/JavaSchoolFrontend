import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateUserComponent() {
    const [state, setState] = useState({
        name: '',
        surname: '',
        dateOfBirth: '',
        rolId: 1
    });

    const navigate = useNavigate();

    const changeNameHandler = (event) => {
        setState({ ...state, name: event.target.value });
    };

    const changeSurnameHandler = (event) => {
        setState({ ...state, surname: event.target.value });
    };

    const changeDateOfBirthHandler = (newDate) => {
        setState({ ...state, dateOfBirth: newDate });
    };

    const cancel = () => {
        navigate('/');
    };

    const saveUser = (event) => {
        event.preventDefault();
        console.log('Usuario guardado:', state);
        // Agrega tu lógica para guardar el usuario en tu base de datos o realizar alguna acción.
    };

    return (
        <div className='mt-5'>
            <div className="container">
                <div className="row">
                    <div className="flex justify-content-center">
                        <h1 className='text-center'>Registro</h1>

                        <div className='justify-content-center'>
                            <div className='mt-2'>
                                <TextField 
                                    id="outlined-basic"
                                    label="Name"
                                    variant="outlined"
                                    color='secondary'
                                    value={state.name}
                                    onChange={changeNameHandler}
                                />
                            </div>
                            <div className='mt-4'>
                                <TextField 
                                    id="outlined-basic"
                                    label="Surname"
                                    variant="outlined"
                                    color='secondary'
                                    value={state.surname}
                                    onChange={changeSurnameHandler}
                                />
                            </div>
                            <div className='mt-4'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker 
                                        label="Basic date picker"
                                        value={state.dateOfBirth}
                                        onChange={changeDateOfBirthHandler}
                                    />
                                </LocalizationProvider>
                            </div>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={saveUser}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={cancel}
                                style={{ marginLeft: "10px" }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUserComponent;
