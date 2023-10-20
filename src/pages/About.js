import React from "react";
import { Navigate } from 'react-router-dom';

function About(){
    const[goToUser, setGoToUser] = React.useState(false);

    if (goToUser) {
        return <Navigate to="/user" />
    }

    return (
        <div>
            About
            <button onClick={() => {setGoToUser(true);}}>{" "} Go to the user page
            </button>
        </div>
    )
}

export default About;