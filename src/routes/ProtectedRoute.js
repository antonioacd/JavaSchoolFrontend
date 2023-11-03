import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';


const ProtectedRoute = ({
    activate,
    redirectPath= '/login'
}) => {

    const accessToken = localStorage.getItem('accessToken');

    console.log(accessToken);
    
    if (!accessToken) {
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet/>

}

export default ProtectedRoute;