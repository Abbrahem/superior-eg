import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const existingItem = cartItems.find(
      item => item._id === product._id && 
               item.selectedColor === selectedColor && 
               item.selectedSize === selectedSize
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === product._id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { 
        ...product, 
        selectedColor, 
        selectedSize, 
        quantity 
      }]);
    }
  };

  const removeFromCart = (productId, selectedColor, selectedSize) => {
    setCartItems(cartItems.filter(
      item => !(item._id === productId && 
                item.selectedColor === selectedColor && 
                item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (productId, selectedColor, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    setCartItems(cartItems.map(item =>
      item._id === productId && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};