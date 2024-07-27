import React from 'react';
import cameraFrame from '../Images/camera-frame.png'
import UploadOrSnap from '../Component/UploadOrSnap';

// Basic welcome page that allows users to choose whether they want to upload a photo or take a photo of food
function Landing() { 
  return (
    <div className="flex text-center items-cener justify-center min-h-screen">
      <div className="flex flex-col text-center items-center justify-center space-y-4 md:mb-16 text-white">
        {/* App name and slogan */}
        <div className="space-y-2">
          <h1 className="font-snell text-6xl">FoodLens</h1>
          <h2 className="font-georgia text-2xl font-bold">Snap it, know it, cook it.</h2>
        </div>
        {/* Camera frame */}
        <img className="max-w-md w-fit mx-10" src={cameraFrame} alt="camera frame"></img>
        <p className="font-serif text-xl mx-10">Wanna know the nutrients of your daily intake or find recipes of your favourite ingredients?</p>
        {/* Buttons for uploading an image and taking a photo */}
        <UploadOrSnap />
      </div>
    </div>
  );
}

export default Landing;