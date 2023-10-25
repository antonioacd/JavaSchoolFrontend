import React from "react";
import { useNavigate } from 'react-router-dom';
import CreateUserComponent from "../../components/User/CreateUserComponent/CreateUserComponent";

function CreateUserPage(){
    return (
        <div>
            <CreateUserComponent/>
        </div>
    )
}

export default CreateUserPage;