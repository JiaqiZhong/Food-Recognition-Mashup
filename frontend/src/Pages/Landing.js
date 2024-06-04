import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import croissant from '../Images/croissant.jpg'
import UploadOrSnap from '../Component/UploadOrSnap';

// Basic welcome page that allows user to select login or sign in
function Landing() { 
  return (
    <div className="flex flex-col text-center items-center justify-center h-screen">
      <h1>FoodLens</h1>
      <img className="m-4 w-80" src={croissant}></img>
      <p className="mx-4">Wanna know the nutrients of your daily intake or find recipes of your favourite ingredients?</p>
      <UploadOrSnap />
    </div>
  );
}

export default Landing;