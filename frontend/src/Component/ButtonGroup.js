import React from 'react';

const ButtonGroup = ({ children }) => {
  return (
    <div className="flex flex-col my-4 space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
      {children}
    </div>
  );
};

export default ButtonGroup