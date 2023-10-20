import React from "react";
import { useNavigate } from 'react-router-dom';

function Home() {
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
        <div style={containerStyle}>
            <img
                src="https://pics.clipartpng.com/midle/Train_PNG_Clipart-1078.png"
                alt="Train"
                style={imageStyle}
            />
            <h1>Railway Train Company</h1>
            
            <button onClick={() => {
                navigate("/users")
            }}>Users</button>

            <button onClick={() => {
                navigate("/searcher")
            }}>Shearch Travel</button>
            
        </div>
    );
}

export default Home;
