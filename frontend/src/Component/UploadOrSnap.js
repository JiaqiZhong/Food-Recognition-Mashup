import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from './Buttons';
import ButtonGroup from './ButtonGroup';

// Basic welcome page that allows user to select login or sign in
function UploadOrSnap() { 
  const navigate = useNavigate();

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

  return (
    <ButtonGroup>
      <div>
        <input
            type="file"
            id="imgFile"
            onChange={handleUploadAnImage}
            hidden
            />
        <label
            htmlFor="imgFile"
            type="button"
            className="bg-orange-400 text-white font-bold py-2 px-4 m-2 rounded shadow-md w-full"
            id="uploadImage">
            Upload An Image
        </label>
      </div>
      <div>
          <PrimaryButton onClick={handleTakeAPhoto}>Take A Photo</PrimaryButton>
      </div>
    </ButtonGroup>
  );
}

export default UploadOrSnap;