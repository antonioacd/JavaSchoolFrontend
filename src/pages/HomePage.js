import React from "react";
import { useNavigate } from 'react-router-dom';

function HomePage() {
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
        <img
                src="/mainback.png"
                alt="Train"
        />
    );
}

export default HomePage;
