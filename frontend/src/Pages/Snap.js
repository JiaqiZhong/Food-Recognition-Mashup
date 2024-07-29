import React, { useRef, useCallback, useState } from "react";
import { PrimaryButton } from '../Component/Buttons';
import ButtonGroup from '../Component/ButtonGroup';
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import camera from "../Images/phone-frame.png";

// "Take A Photo" page that allows the user to turn on the camera and take a photo of food
function Snap() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [isStateOne, setIsStateOne] = useState(true);
    const navigate = useNavigate();

    // Check if the user is on a mobile phone, tablet, or computer
    const isPhoneOrTablet = () => {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    // Create video constraints
    const videoConstraints = {
        // If the user is on a mobile phone or a tablet, open the back camera, else on a computer can only open the front camera
        facingMode: isPhoneOrTablet() ? { exact: 'environment' } : 'user'
    };

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
                    const base64String = reader.result;
                    localStorage.setItem('newImage', base64String);
                    localStorage.setItem('selectedIngredients', []);
                    navigate(`/Recognition`, { state: { image: file, base64: base64String } });
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
        <div className="flex flex-col text-center items-center justify-center h-screen overflow-hidden">
            {/* if an image has been captured */}
            {imgSrc ? (
                <div className="space-y-8 mb-12 overflow-hidden">                    
                    {/* // Display the captured image */}
                    <img src={imgSrc} className="w-80 h-80 shadow-custom object-cover" alt="captured image" />
                    {isStateOne ? ( 
                        // Capture state
                        <ButtonGroup>
                            <PrimaryButton onClick={handleCapture}>Snap</PrimaryButton>
                            <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
                        </ButtonGroup>
                    ) : (
                        // Retake state
                        <ButtonGroup>
                            <PrimaryButton onClick={handleRetake}>Retake</PrimaryButton>
                            <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
                        </ButtonGroup>
                    )}
                </div>
            ) : (
                // if no image has been captured
                <div className="relative w-frame h-frame">
                    {/* Display the webcam and a fake phone frame in a fixed position */}
                    <div>
                        <Webcam ref={webcamRef} mirrored={!isPhoneOrTablet()} videoConstraints={videoConstraints} className="absolute left-72 top-28 h-60 w-96 object-cover"/>
                        <img src={camera} className="absolute w-camera left-14 top-24" alt="phone frame"></img>
                    </div>                
                    <div className="absolute top-96 left-96 right-96">
                        {isStateOne ? ( 
                            // Capture state
                            <ButtonGroup>
                                <PrimaryButton onClick={handleCapture}>Snap</PrimaryButton>
                                <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
                            </ButtonGroup>
                        ) : (
                            // Retake state
                            <ButtonGroup>
                                <PrimaryButton onClick={handleRetake}>Retake</PrimaryButton>
                                <PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>
                            </ButtonGroup>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Snap;