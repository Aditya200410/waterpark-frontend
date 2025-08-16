import axios from 'axios';
import config from '../config/config.js';

const LOCAL_CART_KEY = 'localCart';

const cartService = {
    // Get cart
    getCart: async (email) => {
        if (!email) {
            // Fallback to localStorage
            const localCart = localStorage.getItem(LOCAL_CART_KEY);
            return localCart ? JSON.parse(localCart) : [];
        }
        try {
            const response = await axios.get(`${config.API_URLS.CART}?email=${encodeURIComponent(email)}`, {
                withCredentials: config.CORS.WITH_CREDENTIALS
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add item to cart
    addToCart: async (productId, quantity, email) => {
        if (!email) {
            // LocalStorage fallback
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]');
            const existingIndex = localCart.findIndex(item => item.productId === (productId._id || productId.id || productId));
            if (existingIndex !== -1) {
                localCart[existingIndex].quantity += quantity;
            } else {
                localCart.push({
                    productId: productId._id || productId.id || productId,
                    quantity
                });
            }
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localCart));
            return localCart;
        }

        try {
            const response = await axios.post(
                `${config.API_URLS.CART}/add`,
                { 
                    productId: productId._id || productId.id || productId, 
                    quantity, 
                    email 
                },
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity, email) => {
        if (!email) {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]');
            const itemIndex = localCart.findIndex(item => item.productId === productId);
            if (itemIndex !== -1) {
                localCart[itemIndex].quantity = quantity;
                localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localCart));
            }
            return localCart;
        }

        try {
            const response = await axios.put(
                `${config.API_URLS.CART}/update`,
                { productId, quantity, email },
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Remove item from cart
    removeFromCart: async (productId, email) => {
        if (!email) {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]');
            const updatedCart = localCart.filter(item => item.productId !== productId);
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(updatedCart));
            return updatedCart;
        }

        try {
            const response = await axios.delete(
                `${config.API_URLS.CART}/remove/${productId}`,
                {
                    data: { email },
                    withCredentials: config.CORS.WITH_CREDENTIALS
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear cart
    clearCart: async (email) => {
        if (!email) {
            localStorage.removeItem(LOCAL_CART_KEY);
            return [];
        }

        try {
            const response = await axios.delete(`${config.API_URLS.CART}/clear`, {
                data: { email },
                withCredentials: config.CORS.WITH_CREDENTIALS
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default cartService;
