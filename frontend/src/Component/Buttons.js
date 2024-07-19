import React from 'react';

// General-purpose buttons
const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      className="bg-white font-bold text-lg text-gray-800 font-georgia py-2 px-4 rounded w-full shadow-custom transition-transform transform hover:scale-105"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Switch buttons for "nutrition facts" and "find recipes"
const SecondaryButton = ({ children, onClick, isActive }) => {
  return (
    <button
      className={`font-bold font-georgia py-2 px-4 shadow-md rounded w-full ${
          isActive ? 'bg-secondaryButtonColor text-black' : 'bg-transparent text-white'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { PrimaryButton, SecondaryButton };