import React from 'react';
import UploadOrSnap from '../Component/UploadOrSnap';

// Basic welcome page that allows users to choose whether they want to upload a photo or take a photo of food
function Landing() { 
  return (
    <div className="flex text-center items-center justify-center min-h-screen">
      <div className="flex flex-col text-center items-center justify-center text-white mx-8 space-y-4 md:mb-16 sm:mt-8 lg:mt-0">
          {/* App name and slogan */}
          <h1 className="font-snell text-6xl">FoodLens</h1>
          <h2 className="font-georgia text-2xl font-bold">Snap it, know it, cook it.</h2>
          {/* Camera frame */}
          <img className="max-w-md w-full" src={`${process.env.PUBLIC_URL}/Images/camera-frame.png`} alt="camera frame"></img>
          <p className="font-serif text-xl">Wanna know the nutrients of your daily intake or find recipes of your favourite ingredients?</p>
          {/* Buttons for uploading an image and taking a photo */}
          <UploadOrSnap />
        </div>
    </div>
  );
}

export default Landing;