import React, { useState } from 'react';
import appLogo from '../Icons/app-logo.png';
import profileIcon from '../Icons/profile-icon.png';
import menuIcon from '../Icons/menu-icon.png'

function Navbar() {
  // Set initial state of menu to be closed
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Open menu
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  }

  return (
    <nav className="flex flex-col sm:flex-row bg-white sm:h-14 px-6 py-4 bg-opacity-75 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
          <div className="flex flex-row w-full sm:w-auto justify-between">
            {/* Show menu button only on small screen */}
            <button className="sm:hidden" onClick={toggleMenu}>
              <img className="w-8" src={menuIcon}></img>
            </button>
            {/* App logo */}
            <img src={appLogo} className="w-14 h-full sm:mr-8"></img>    
            {/* Profile icon */}
            <a href="/" className="w-8 sm:hidden">
              <img src={profileIcon}></img>
            </a>
          </div>
          <div id="menu" className={`flex w-full flex-col sm:block sm:flex-row sm:space-x-8 m-4 ${isMenuVisible ? 'block' : 'hidden'}`}>
              <a href="/" className="text-black font-serif font-bold text-xl no-underline hover:underline">Home</a>
              <a href="/" className="text-black font-serif font-bold text-xl no-underline hover:underline">Nutrition Tips</a>
              <a href="/" className="text-black font-serif font-bold text-xl no-underline hover:underline">Collections</a>
              <a href="/" className="text-black font-serif font-bold text-xl no-underline hover:underline">About Us</a>
          </div>
        </div>
        <a href="/" className="w-8 hidden sm:block">
          <img src={profileIcon}></img>
        </a>
    </nav>
  );
}

export default Navbar;