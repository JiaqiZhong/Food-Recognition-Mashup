import React, {useState} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ButtonGroup from '../Component/ButtonGroup';
import { PrimaryButton } from '../Component/Buttons';

function Preview() {
    const location = useLocation();
    const navigate = useNavigate();
    const imageFile = location.state.image;

    // Back to the landing page
    const handleCancel = (e) => {
        e.preventDefault();
        navigate("/");
    }    
    
    // Navigate to the food recognition page
    const handleConfirm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("food_image", imageFile);
        // Pass the image data to the food recognition page
        navigate(`/Recognition`, { state: { image: imageFile } });
    }

    return (
        <div className="flex text-center items-center justify-center min-h-screen">
            <div className="md:mb-8">
                {imageFile && <img className="w-80 shadow-custom" src={URL.createObjectURL(imageFile)} alt="uploaded image" />}
                <ButtonGroup>
                    <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
                    <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default Preview;