import React from 'react';

// UI for two general-purpose buttons
const ButtonGroup = ({ children }) => {
  return (
    <div className="flex flex-col my-4 space-y-4 lg:flex-row lg:space-x-8 lg:space-y-0">
      {children}
    </div>
  );
};

export default ButtonGroup