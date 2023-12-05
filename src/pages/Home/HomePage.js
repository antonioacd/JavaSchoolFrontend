import React from "react";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleSearchSchedulesClick = () => {
        // Redirige a la ruta "/schedule/search" al hacer clic en el botón
        navigate('/schedule/search');
    };

    return (
        <div className="container-background">
            <button
                type="button"
                className="btn btn-primary button"
                onClick={handleSearchSchedulesClick}
            >
                Search Schedules
            </button>
        </div>
    );
}

export default HomePage;
