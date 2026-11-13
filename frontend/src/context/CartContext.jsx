import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    totalAmount: 0,
    totalItemsCount: 0
  });
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart whenever user status changes
  const fetchCart = async () => {
    if (!user) {
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        totalAmount: 0,
        totalItemsCount: 0
      });
      return;
    }

    try {
      setCartLoading(true);
      const response = await API.get('/cart');
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1, size = 'M', color = 'Black') => {
    if (!user) {
      return { success: false, message: 'Please log in to add items to cart' };
    }

    try {
      const response = await API.post('/cart', { productId, quantity, size, color });
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message: msg };
    }
  };

  // Update item quantity or attributes
  const updateCartItem = async (itemId, quantity, size, color) => {
    try {
      const response = await API.put(`/cart/${itemId}`, { quantity, size, color });
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update item';
      return { success: false, message: msg };
    }
  };

  // Remove single item from cart
  const removeCartItem = async (itemId) => {
    try {
      const response = await API.delete(`/cart/${itemId}`);
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove item';
      return { success: false, message: msg };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const response = await API.delete('/cart');
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to clear cart';
      return { success: false, message: msg };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
