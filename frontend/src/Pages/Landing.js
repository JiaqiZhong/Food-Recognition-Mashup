import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraFrame from '../Images/camera-frame.png'
import UploadOrSnap from '../Component/UploadOrSnap';
import './Landing.css';

// Basic welcome page that allows user to select login or sign in
function Landing() { 
  return (
    <div>
      <div className="flex flex-col text-center items-center justify-center space-y-4 min-h-screen text-white">
        <h1 className="font-snell text-5xl">Snap it, know it, cook it</h1>
        <img className="max-w-md" src={cameraFrame}></img>
        <p className="font-serif text-xl">Wanna know the nutrients of your daily intake or find recipes of your favourite ingredients?</p>
        <UploadOrSnap />
      </div>
    </div>
  );
}

export default Landing;