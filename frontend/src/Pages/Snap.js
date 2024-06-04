import React, { useRef, useCallback, useState } from "react";
import { PrimaryButton } from '../Component/Buttons';
import ButtonGroup from '../Component/ButtonGroup';
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function Snap() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [isStateOne, setIsStateOne] = useState(true);
    const navigate = useNavigate();

    // create a capture function
    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);
        setImgSrc(imageSrc);
        setIsStateOne(false);
    }, [webcamRef]);

    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/');
    }

    const handleConfirm = (e) => {
        e.preventDefault();
        dataUrlToFile(imgSrc)
        .then((file) => {
        console.log(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    //navigate(`/Preview?image=${encodeURIComponent(reader.result)}`);
                    navigate(`/Recognition`, { state: { image: file } });
                }
                reader.readAsDataURL(file);
            }
        });
    }

    const handleRetake = (e) => {
        e.preventDefault();
        setIsStateOne(true);
        setImgSrc(null);
    }

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
            {imgSrc ? (
                <img src={imgSrc} alt="webcam" />
            ) : (
                <Webcam height={600} width={600} ref={webcamRef} mirrored={true}/>
            )}
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
    );
}

export default Snap;