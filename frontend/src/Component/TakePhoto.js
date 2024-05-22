import React from "react";
import Webcam from "react-webcam";
import { useNavigate } from 'react-router-dom';

function TakePhoto() {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/Snap');
    }

    return (
        <div>
            <button onClick={handleClick}>Take A Photo</button>
        </div>
    );
}

export default TakePhoto;