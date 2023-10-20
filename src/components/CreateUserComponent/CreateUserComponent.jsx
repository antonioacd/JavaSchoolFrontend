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

    const changeDateOfBirthHandler = (event) => {
        setState({ ...state, dateOfBirth: event.target.value });
    };

    const cancel = () => {
        navigate('/');
    };

    const saveUser = (event) => {
        event.preventDefault();
        console.log('Usuario guardado:', state);
        // Aquí puedes agregar la lógica para guardar el usuario en tu base de datos o realizar alguna acción.
        // Por ejemplo, puedes enviar los datos a una API o almacenarlos en el estado global de la aplicación.
    };

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3">
                        <h1 className='text-center'>Registro</h1>

                        <div className='card-body'>
                            <form>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        placeholder='Name'
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={state.name}
                                        onChange={changeNameHandler}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Surname:</label>
                                    <input
                                        placeholder='Surname'
                                        type="text"
                                        className="form-control"
                                        name="surname"
                                        value={state.surname}
                                        onChange={changeSurnameHandler}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of birth:</label>
                                    <input
                                        placeholder='Date of birth'
                                        type="date"
                                        className="form-control"
                                        name="date_of_birth"
                                        value={state.dateOfBirth}
                                        onChange={changeDateOfBirthHandler}
                                    />
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUserComponent;
