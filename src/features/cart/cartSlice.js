import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const loadCartFromStorage = () => {
  const encryptedCartData = localStorage.getItem("vCart");
  if (!encryptedCartData) return [];

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedCartData, ENCRYPTION_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData || [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (cartData) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(cartData), ENCRYPTION_KEY).toString();
    localStorage.setItem("vCart", encryptedData);
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];
        existingItem.quantity += newItem.quantity || 1;
        existingItem.totalPrice = existingItem.quantity * newItem.price;
        existingItem.point = existingItem.quantity * newItem.id;
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.totalPrice || newItem.price,
          point: newItem.point || newItem.id,
        });
      }
      saveCartToStorage(state.cartItems);
    },
    minusItemFromCart: (state, action) => {
      const targetId = action.payload.id;
      const existingItemIndex = state.cartItems.findIndex((item) => item.id === targetId);

      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          existingItem.totalPrice = existingItem.quantity * action.payload.price;
          existingItem.point = existingItem.quantity * action.payload.id;
        } else {
          state.cartItems.splice(existingItemIndex, 1);
        }
      }
      saveCartToStorage(state.cartItems);
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartToStorage(state.cartItems);
    },
  },
});

export const { addItemToCart, minusItemFromCart, removeItemFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalItemCart = (state) => state.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) => state.cart.cartItems.reduce((total, item) => total + item.totalPrice, 0);
export const selectTotalPoint = (state) => state.cart.cartItems.reduce((total, item) => total + item.point, 0);
