import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Add some products to get started</p>
          <Link
            to="/"
            className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = 40;
  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <div key={`${item._id}-${item.selectedColor}-${item.selectedSize}`} className="bg-gray-900 rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-full h-full object-contain rounded bg-gray-800"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-400 mb-2">Color: {item.selectedColor}</p>
                  <p className="text-gray-400 mb-2">Size: {item.selectedSize}</p>
                  <p className="text-gray-400 mb-4">Quantity: {item.quantity}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 mb-4">
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                      className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-800 rounded">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                      className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id, item.selectedColor, item.selectedSize)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-2xl font-bold">{item.price * item.quantity} EGP</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shippingCost} EGP</span>
            </div>
            <hr className="border-gray-700" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>{total} EGP</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-white text-black py-3 rounded font-medium hover:bg-gray-200 transition-colors mt-6 block text-center"
          >
            BUY NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;