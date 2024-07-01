import React from 'react';
import croissant from '../Images/croissant.png'

function Navbar() {
  return (
    <nav className="flex bg-white h-14 bg-opacity-50 items-center">
        <div className="space-x-8 m-4">
            <a href="/" className="text-black font-serif font-bold text-xl no-underline">Home</a>
            <a href="/" className="text-black font-serif font-bold text-xl no-underline">Nutrition Tips</a>
            <a href="/" className="text-black font-serif font-bold text-xl no-underline">Collections</a>
            <a href="/" className="text-black font-serif font-bold text-xl no-underline">About Us</a>
        </div>
    </nav>
  );
}

export default Navbar;