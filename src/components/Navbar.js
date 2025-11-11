import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartItems } = useContext(CartContext);

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-black text-white py-4 px-6 flex justify-between items-center">
      {/* Left - Dropdown Menu */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-50">
            <Link to="/" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-800 transition-colors">Home</Link>
            <Link to="/about" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-800 transition-colors">About</Link>
            <Link to="/contact" onClick={handleLinkClick} className="block px-4 py-2 hover:bg-gray-800 transition-colors">Contact</Link>
          </div>
        )}
      </div>

      {/* Center - Logo */}
      <Link to="/" className="flex-1 flex justify-center">
        <div className="bg-black px-4 py-2">
          <img 
            src="/superior.jpg" 
            alt="SUPERIOR.EG" 
            className="h-12 w-auto object-contain"
            style={{
              filter: 'none',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      </Link>

      {/* Right - Cart */}
      <Link to="/cart" className="relative">
        <svg className="w-6 h-6 text-white hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </Link>
    </nav>
  );
};

export default Navbar;