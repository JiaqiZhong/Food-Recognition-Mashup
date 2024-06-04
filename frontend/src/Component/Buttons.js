import React from 'react';

const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      className="bg-orange-400 font-bold text-white py-2 px-4 m-2 rounded shadow-md w-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SecondaryButton = ({ children, onClick, isActive }) => {
  return (
    <button
      className={`border-2 border-orange-400 font-bold text-orange-400 py-2 px-4 m-2 rounded shadow-md w-full ${
          isActive ? 'bg-orange-400 text-white' : 'bg-transparent text-orange-400'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { PrimaryButton, SecondaryButton };