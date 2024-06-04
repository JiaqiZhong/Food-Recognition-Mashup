import React from 'react';

const ButtonGroup = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
      {children}
    </div>
  );
};

export default ButtonGroup