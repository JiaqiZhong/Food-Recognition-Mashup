import React, { useRef, useCallback, useState } from "react";
import { PrimaryButton } from '../Component/Buttons';
import ButtonGroup from '../Component/ButtonGroup';
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import camera from "../Images/phone-frame.png";

function Snap() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [isStateOne, setIsStateOne] = useState(true);
    const navigate = useNavigate();

    // Create a capture function
    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);
        setImgSrc(imageSrc);
        setIsStateOne(false);
    }, [webcamRef]);

    // Back to the landing page
    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    }

    // Navigate to the food recognition page
    const handleConfirm = (e) => {
        e.preventDefault();
        dataUrlToFile(imgSrc)
        .then((file) => {
        console.log(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Pass the snapped photo to the food recognition page
                    navigate(`/Recognition`, { state: { image: file } });
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Retake photo
    const handleRetake = (e) => {
        e.preventDefault();
        setIsStateOne(true);
        setImgSrc(null);
    }

    // Convert the image to image file
    function dataUrlToFile(dataUrl) {
        let file = (fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                return new File([blob], "snapshot.png", { type: "image/png" })
            })
        );
        return file;
    }

    return (
        <div className="flex flex-col text-center items-center justify-center h-screen">
            <div className="relative w-frame h-frame">
                {imgSrc ? (
                    // Display the captured image
                    <img src={imgSrc} className="absolute left-72 top-28 h-60 w-96 object-cover" alt="captured image" />
                ) : (
                    // Display the webcam and a fake phone frame
                    <div>
                        <Webcam ref={webcamRef} mirrored={true} className="absolute left-72 top-28 h-60 w-96 object-cover"/>
                        <img src={camera} className="absolute w-camera left-14 top-24" alt="phone frame"></img>
                    </div>
                )}
                <div className="absolute top-96 left-96 right-96">
                    {isStateOne ? ( 
                        <ButtonGroup>
                            <PrimaryButton onClick={handleCapture}>Snap</PrimaryButton>
                            <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
                        </ButtonGroup>
                    ) : (
                        <ButtonGroup>
                            <PrimaryButton onClick={handleRetake}>Retake</PrimaryButton>
                            <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
                        </ButtonGroup>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Snap;