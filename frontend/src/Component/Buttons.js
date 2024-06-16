import React from 'react';

const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      className="bg-white font-bold text-lg text-gray-800 font-georgia py-2 px-4 rounded w-full shadow-custom"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SecondaryButton = ({ children, onClick, isActive }) => {
  return (
    <button
      className={`border-2 border-gray-800 font-bold text-gray-800 py-2 px-4 rounded shadow-md w-full ${
          isActive ? 'bg-gray-800 text-white' : 'bg-transparent text-orange-400'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { PrimaryButton, SecondaryButton };