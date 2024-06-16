import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraFrame from '../Images/camera-frame.png'
import UploadOrSnap from '../Component/UploadOrSnap';
import './Landing.css';

// Basic welcome page that allows user to select login or sign in
function Landing() { 
  return (
    <div className="flex flex-col text-center items-center justify-center bg-original bg-cover bg-center bg-no-repeat text-white h-custom">
      <div className="flex flex-col text-center items-center justify-center m-4 space-y-4">
        <h1 className="font-snell text-5xl">Snap it, know it, cook it</h1>
        <img className="max-w-md" src={cameraFrame}></img>
        <p className="font-serif text-xl">Wanna know the nutrients of your daily intake or find recipes of your favourite ingredients?</p>
        <UploadOrSnap />
      </div>
    </div>
  );
}

export default Landing;