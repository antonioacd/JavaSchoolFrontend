import React from "react";
import { useNavigate } from 'react-router-dom';
import CreateUserComponent from "../components/CreateUserComponent/CreateUserComponent";

function User(){
    const navigate = useNavigate();

    return (
        <div>
            <CreateUserComponent></CreateUserComponent>
            User <button onClick={() => {
                navigate("/")
            }}> Go to the home page</button>
        </div>
    )
}

export default User;