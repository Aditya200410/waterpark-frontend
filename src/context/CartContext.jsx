import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

const CartContext = createContext();
const LOCAL_CART_KEY = 'cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellerToken, setSellerToken] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Load cart from backend or localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isAuthenticated && user?.email) {
          const cartData = await cartService.getCart(user.email);
          setCartItems(cartData.items || []);
        } else {
          const savedCart = localStorage.getItem(LOCAL_CART_KEY);
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Failed to load cart', error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [isAuthenticated, user]);

  // Save cart to localStorage when user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Seller token logic (unchanged)
  const SELLER_TOKEN_KEY = 'sellerToken';
  const SELLER_TOKEN_EXPIRY_HOURS = 4320; // 180 days

  const setSellerTokenWithExpiry = (token) => {
    localStorage.setItem(
      SELLER_TOKEN_KEY,
      JSON.stringify({ token, timestamp: Date.now() })
    );
  };

  const getSellerTokenWithExpiry = () => {
    const dataStr = localStorage.getItem(SELLER_TOKEN_KEY);
    if (!dataStr) return null;
    try {
      const { token, timestamp } = JSON.parse(dataStr);
      if (!token || !timestamp) return null;
      const age = Date.now() - timestamp;
      if (age > SELLER_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000) {
        localStorage.removeItem(SELLER_TOKEN_KEY);
        return null;
      }
      return token;
    } catch {
      localStorage.removeItem(SELLER_TOKEN_KEY);
      return null;
    }
  };

 




  // Cart functions
  const addToCart = async (productId, quantity = 1) => {
    try {
      if (isAuthenticated && user?.email) {
        const updatedCart = await cartService.addToCart(productId, quantity, user.email);
        setCartItems(updatedCart.items);
      } else {
        // LocalStorage fallback
        const existingIndex = cartItems.findIndex(
          item => item.productId === (productId._id || productId.id || productId)
        );
        let updatedCart;
        if (existingIndex !== -1) {
          cartItems[existingIndex].quantity += quantity;
          updatedCart = [...cartItems];
        } else {
          updatedCart = [...cartItems, { productId: productId._id || productId.id || productId, quantity }];
        }
        setCartItems(updatedCart);
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
      }
      toast.success('Item added to cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error(error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated && user?.email) {
        const updatedCart = await cartService.removeFromCart(productId, user.email);
        setCartItems(updatedCart.items);
      } else {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
      }
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error(error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      if (isAuthenticated && user?.email) {
        const updatedCart = await cartService.updateQuantity(productId, quantity, user.email);
        setCartItems(updatedCart.items);
      } else {
        const updatedCart = cartItems.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
      }
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated && user?.email) {
        await cartService.clearCart(user.email);
        setCartItems([]);
      } else {
        setCartItems([]);
        localStorage.removeItem(LOCAL_CART_KEY);
      }
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error(error);
    }
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const getItemImage = (item) => item.images?.[0] || item.product?.image || item.image || item.product?.images?.[0];

  // Sync local cart with backend on login
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]');
          if (localCart.length > 0) {
            for (const item of localCart) {
              await cartService.addToCart(item.productId, item.quantity, user.email);
            }
            localStorage.removeItem(LOCAL_CART_KEY);
            const cartData = await cartService.getCart(user.email);
            setCartItems(cartData.items || []);
          }
        } catch (error) {
          console.error('Failed to sync local cart', error);
        }
      }
    };
    syncCart();
  }, [isAuthenticated, user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        loading,
        getItemImage,
      
   
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
