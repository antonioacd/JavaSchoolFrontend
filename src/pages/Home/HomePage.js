import React from "react";
import "./HomePage.css";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleSearchSchedulesClick = () => {
        // Redirige a la ruta "/schedule/search" al hacer clic en el botón
        navigate('/schedule/search');
    };

    return (
        <div className="container-background">
            <div className="title">Uncover the magic of train travel, where the journey is as captivating as the destination</div>
            <button
                type="button"
                className="btn btn-primary button"
                onClick={handleSearchSchedulesClick}
            >
                <SearchIcon style={{ marginRight: 8 }} /> Plan Your Journey
            </button>
        </div>
    );
}

export default HomePage;
