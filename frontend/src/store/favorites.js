import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';


// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_BASE_URL}/get-user-favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (book, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${API_BASE_URL}/add-to-favorites`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          bookid: book._id,
          id: userId,
        },
      });
      return { book, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (bookId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(`${API_BASE_URL}/remove-from-favorites/${bookId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });
      return { bookId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    addToFavoritesLocal: (state, action) => {
      const book = action.payload;
      if (!state.items.find(item => item._id === book._id)) {
        state.items.push(book);
        state.totalItems = state.items.length;
      }
    },
    removeFromFavoritesLocal: (state, action) => {
      const bookId = action.payload;
      state.items = state.items.filter(item => item._id !== bookId);
      state.totalItems = state.items.length;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.totalItems = state.items.length;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const book = action.payload.book;
        if (!state.items.find(item => item._id === book._id)) {
          state.items.push(book);
          state.totalItems = state.items.length;
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const bookId = action.payload.bookId;
        state.items = state.items.filter(item => item._id !== bookId);
        state.totalItems = state.items.length;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearFavorites,
  clearError,
  addToFavoritesLocal,
  removeFromFavoritesLocal,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
