import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';


const ProtectedRoute = ({
    redirectPath= '/login'
}) => {

    const token = localStorage.getItem('token'); // O desde las cookies

    console.log("Tocken", token);
    
    if (!token) {
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet/>

}

export default ProtectedRoute;