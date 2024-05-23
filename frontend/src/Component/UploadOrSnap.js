import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="upload-or-snap">
      <div className="button-panel">
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
                id="uploadImage">
                Upload An Image
            </label>
        </div>
        <div>
            <button onClick={handleTakeAPhoto}>Take A Photo</button>
        </div>
      </div>
    </div>
  );
}

export default UploadOrSnap;