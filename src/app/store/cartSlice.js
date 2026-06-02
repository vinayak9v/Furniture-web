import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    // 1. पेज लोड होने पर LocalStorage से डेटा रेडक्स में डालने के लिए
    setCart: (state, action) => {
      state.items = action.payload;
    },
    
    // 2. Add To Cart (और LocalStorage में सेव करना)
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // सेव टू लोकल स्टोरेज
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    // 3. Update Quantity (और LocalStorage में सेव करना)
    updateQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity = Math.max(1, existingItem.quantity + delta);
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },

    // 4. Remove Item (और LocalStorage में सेव करना)
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    // 5. Clear Cart (पेमेंट सक्सेस होने के बाद कार्ट खाली करने के लिए)
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;