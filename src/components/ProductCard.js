import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuickOrderSheet from './QuickOrderSheet';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const handleQuickOrderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickOrderOpen(true);
  };

  return (
    <>
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <div 
            className="bg-black rounded-lg overflow-hidden hover:bg-gray-900 transition-all duration-300 relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Sold Out Overlay */}
            {product.soldOut && (
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded z-10">
                SOLD OUT
              </div>
            )}

            {/* Quick Order Button */}
            <button
              onClick={handleQuickOrderClick}
              className="absolute top-2 right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-all z-10 shadow-lg"
              title="Quick Order"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </button>

            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={product.images && product.images.length > 0 
                  ? product.images[currentImageIndex]
                  : '/placeholder-image.jpg'
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-white font-medium text-sm mb-2 truncate">
                {product.name}
              </h3>
              <p className="text-white font-bold text-lg">
                {product.price} EGP
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Order Bottom Sheet */}
      <QuickOrderSheet 
        product={product}
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
      />
    </>
  );
};

export default ProductCard;