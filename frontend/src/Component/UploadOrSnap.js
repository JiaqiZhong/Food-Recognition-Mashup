import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from './Buttons';
import ButtonGroup from './ButtonGroup';

// Basic welcome page that allows user to select login or sign in
function UploadOrSnap() { 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Button listener for "Upload An Image"
  const handleUploadAnImage = (e) => {
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

  // Button Listener for "Take A Photo"
  const handleTakeAPhoto = (e) => {
    e.preventDefault();
    navigate('/Snap');
  }

  const triggerFileInput = () => {
    fileInputRef.current.click();
  }

  return (
    <ButtonGroup>
      <div>
        <PrimaryButton onClick={triggerFileInput}>Upload An Image</PrimaryButton>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadAnImage}
            hidden
        />
      </div>
      <div>
          <PrimaryButton onClick={handleTakeAPhoto}>Take A Photo</PrimaryButton>
      </div>
    </ButtonGroup>
  );
}

export default UploadOrSnap;