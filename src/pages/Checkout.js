import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from '../config/axios';
import Swal from 'sweetalert2';

const Checkout = () => {
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone1: '',
    phone2: '',
    promoCode: ''
  });
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  // Check if this is a quick order
  useEffect(() => {
    if (location.state?.product) {
      setQuickOrderProduct(location.state.product);
    }
  }, [location]);

  const shippingCost = 40;
  const items = quickOrderProduct ? [quickOrderProduct] : cartItems;
  const subtotal = quickOrderProduct 
    ? quickOrderProduct.price * quickOrderProduct.quantity 
    : getCartTotal();
  const total = subtotal + shippingCost - discount;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePromoCode = async () => {
    if (!formData.promoCode.trim()) return;

    try {
      const response = await axios.post('/api/promocodes/validate', {
        code: formData.promoCode
      });
      
      const discountAmount = (subtotal * response.data.discount) / 100;
      setDiscount(discountAmount);
      setPromoApplied(true);
      
      Swal.fire({
        title: 'Promo Code Applied!',
        text: `${response.data.discount}% discount applied`,
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    } catch (error) {
      Swal.fire({
        title: 'Invalid Promo Code',
        text: 'The promo code is invalid or expired',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.address || !formData.phone1 || !formData.phone2) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
      return;
    }

    if (formData.phone1 === formData.phone2) {
      Swal.fire({
        title: 'Invalid Phone Numbers',
        text: 'Phone numbers must be different',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
      return;
    }

    try {
      // Create orders for each item (cart or quick order)
      for (const item of items) {
        await axios.post('/api/orders', {
          productId: item._id,
          customerName: formData.customerName,
          address: formData.address,
          phone1: formData.phone1,
          phone2: formData.phone2,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          quantity: item.quantity || 1,
          promoCode: promoApplied ? formData.promoCode : ''
        });
      }

      // Clear cart only if it's not a quick order
      if (!quickOrderProduct) {
        clearCart();
      }
      
      Swal.fire({
        title: 'Order Placed Successfully!',
        text: 'Thank you for your order. We will contact you soon.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      }).then(() => {
        window.location.href = '/';
      });

    } catch (error) {
      Swal.fire({
        title: 'Order Failed',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">No Items to Checkout</h2>
          <a href="/" className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200 transition-colors">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-400 text-sm">Color: {item.selectedColor}</p>
                      <p className="text-gray-400 text-sm">Size: {item.selectedSize}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.price * (item.quantity || 1)} EGP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  placeholder="Promo Code"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  disabled={promoApplied}
                  className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-white disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={validatePromoCode}
                  disabled={promoApplied}
                  className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotal} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingCost} EGP</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount:</span>
                    <span>-{discount} EGP</span>
                  </div>
                )}
                <hr className="border-gray-700" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{total} EGP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Full Name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-900 text-white px-3 py-3 rounded border border-gray-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <textarea
                  name="address"
                  placeholder="Detailed Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full bg-gray-900 text-white px-3 py-3 rounded border border-gray-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone1"
                  placeholder="Phone Number 1"
                  value={formData.phone1}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-900 text-white px-3 py-3 rounded border border-gray-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone2"
                  placeholder="Phone Number 2"
                  value={formData.phone2}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-900 text-white px-3 py-3 rounded border border-gray-700 focus:outline-none focus:border-white"
                />
              </div>

              {/* Payment Info */}
              <div className="bg-gray-900 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-300 mb-2">
                  For payment visa or telda or Instapay or Vodafone Cash: +20 109 204 5566
                </p>
                <p className="text-sm text-gray-300">
                  For cash on delivery, please contact the number above after placing your order.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded font-medium hover:bg-gray-200 transition-colors mt-6"
              >
                BUY IT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;