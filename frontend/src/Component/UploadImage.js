import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadImage() {
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const inputImage = e.target.files[0];
        console.log(inputImage);
        if (inputImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                //navigate(`/Preview?image=${encodeURIComponent(reader.result)}`);
                navigate(`/Preview`, { state: { image: inputImage } });
            }
            reader.readAsDataURL(inputImage);
        }
    }

    return (
        <div>
            <input
                type="file"
                id="imgFile"
                onChange={handleFileChange}
                hidden
                />
            <label
                htmlFor="imgFile"
                type="button"
                id="uploadImage">
                Upload An Image
            </label>
        </div>
    );
}

export default UploadImage;