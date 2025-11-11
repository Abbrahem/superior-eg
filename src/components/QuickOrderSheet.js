import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const QuickOrderSheet = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleQuickOrder = () => {
    if (!selectedColor || !selectedSize) {
      Swal.fire({
        title: 'Missing Selection',
        text: 'Please select color and size',
        icon: 'warning',
        background: '#1f1f1f',
        color: '#ffffff'
      });
      return;
    }

    // Navigate to checkout with product data
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          selectedColor,
          selectedSize,
          quantity
        }
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-50 transform transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>

        <div className="p-6 pb-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">Quick Order</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
              <img
                src={product.images?.[0] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-green-400 font-bold text-xl">{product.price} EGP</p>
              {product.soldOut && (
                <span className="text-red-500 text-sm font-semibold">SOLD OUT</span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Select Color</label>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedColor === color
                      ? 'border-white bg-white text-black'
                      : 'border-gray-600 bg-gray-800 text-white hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all font-bold ${
                    selectedSize === size
                      ? 'border-white bg-white text-black'
                      : 'border-gray-600 bg-gray-800 text-white hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-800 text-white font-bold hover:bg-gray-700"
              >
                -
              </button>
              <span className="text-white text-xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-800 text-white font-bold hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-bold text-2xl">{product.price * quantity} EGP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border-2 border-gray-600 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleQuickOrder}
              disabled={product.soldOut}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                product.soldOut
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {product.soldOut ? 'Sold Out' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickOrderSheet;
