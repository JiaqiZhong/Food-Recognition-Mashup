import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from './Buttons';
import ButtonGroup from './ButtonGroup';
import imageCompression from 'browser-image-compression';

// Buttons for uploading an image or taking a photo
function UploadOrSnap() { 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Button listener for "Upload An Image"
  const handleUploadAnImage = async (e) => {
    const inputImage = e.target.files[0];
    console.log(inputImage);

    if (inputImage) {
      try {
        // Compression options
        const options = {
          maxSizeMB: 2,
          useWebWorker: true
        };

        // Compress the image
        const compressedFile = await imageCompression(inputImage, options);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          // Navigate to the preview page with compressed image data
          navigate('/Preview', { state: { image: compressedFile, base64: base64 } });
          localStorage.setItem('newImage', base64);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing or storing image:', error);
      }
    }
  };

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