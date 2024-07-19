import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from './Buttons';
import ButtonGroup from './ButtonGroup';

// Buttons for uploading an image or taking a photo
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
              const base64 = reader.result;
              // Pass the image data to the preview page
              navigate(`/Preview`, { state: { image: inputImage, base64: base64 } });
              localStorage.setItem('newImage', base64);
          }
          reader.readAsDataURL(inputImage);
      }
  }

  // Button Listener for "Take A Photo"
  const handleTakeAPhoto = (e) => {
    e.preventDefault();
    navigate('/Snap');
  }

  // When user clicks "Upload An Image" button
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