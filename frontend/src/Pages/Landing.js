import React, { useState } from 'react';
import './Landing.css';
import UploadImage from '../Component/UploadImage'
import TakePhoto from '../Component/TakePhoto';
import croissant from '../Images/croissant.jpg'

// Basic welcome page that allows user to select login or sign in
function Landing() {  
  const [isUploadImage, setIsUploadImage] = useState(true);

  // Toggle on and off between Signup & Login
  const toggleComponent = () => {
    setIsUploadImage(!isUploadImage);
  };

  return (
    <div className="landing">
      <h1>FoodLens</h1>
      <img className="croissant" src={croissant}></img>
      <p>Wanna know the nutrients of your daily intake or find recipes of your favourite ingredients?</p>
      <div className="button-panel">
        <UploadImage/>
        <TakePhoto/>
      </div>
    </div>
  );
}

export default Landing;