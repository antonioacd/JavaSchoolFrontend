import React from "react";
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
    };

    const imageStyle = {
        maxWidth: "100%",
    };

    const navigate = useNavigate();

    return (
        <div className="text-center">

            <h1>Error 404</h1>

            <img
                src="https://pics.clipartpng.com/midle/Train_PNG_Clipart-1078.png"
                alt="Train"
            />
            
        </div>
    );
}

export default ErrorPage;