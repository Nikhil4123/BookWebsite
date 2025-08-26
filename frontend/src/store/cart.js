import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_BASE_URL}/get-users-carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (bookId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${API_BASE_URL}/add-to-cart`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          bookid: bookId,
          id: userId,
        },
      });
      return { bookId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (bookId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${API_BASE_URL}/remove-from-cart/${bookId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });
      return { bookId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateQuantity: (state, action) => {
      const { bookId, quantity } = action.payload;
      const item = state.items.find(item => item._id === bookId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh cart after adding
        // The cart will be refreshed by calling fetchCart
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh cart after removing
        // The cart will be refreshed by calling fetchCart
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCart,
  clearError,
  updateQuantity,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
