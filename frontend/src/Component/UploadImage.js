import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "../Pages/Preview";

function UploadImage() {
    //const [inputImage, setInputImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [reader, setReader] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const inputImage = e.target.files[0];
        if (inputImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                navigate(`/Preview?image=${encodeURIComponent(reader.result)}`);
            }
            reader.readAsDataURL(inputImage);        
        }
        console.log(inputImage);


    }

    const handleUpload = (e) => {

    }

    function getPredictionsByUploadingImage() {
        const formData = new FormData();

        // if (inputImage) {
        //     formData.append("food_image", inputImage);
        //     reader.onload = () => {
        //         setUploadedImage(reader.result);
        //         // getPredictions(url, options)
        //     }
        //     reader.readAsDataURL(inputImage);
        // }

        console.log(reader.result);
    
        const url = "/recognition/upload";
        const options = {
            method: 'POST',
            body: formData
        };
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
            {uploadedImage && (<img src={uploadedImage} alt="?"/>)}
        </div>
    );
}

export default UploadImage;