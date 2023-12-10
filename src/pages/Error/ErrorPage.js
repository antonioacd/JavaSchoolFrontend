import React from "react";
import "./ErrorPage.css";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
function ErrorPage() {

    const navigate = useNavigate();

    const handleSearchSchedulesClick = () => {
        navigate('/');
    };

    return (
        <div className="main-container-404">

            <img className="image-404"
                src="/404page.png"
                alt="Error 404"
            />

            <button
                type="button"
                className="btn btn-primary button"
                onClick={handleSearchSchedulesClick}
            >
                <HomeIcon style={{ marginRight: 8 }} /> Go back to home
            </button>
        </div>
    );
}

export default ErrorPage;
