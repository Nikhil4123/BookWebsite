import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Async thunks
export const fetchListings = createAsyncThunk(
  'market/fetchListings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await axios.get(`${API_BASE_URL}/market/listings?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listings');
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  'market/fetchMyListings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_BASE_URL}/market/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my listings');
    }
  }
);

export const fetchListing = createAsyncThunk(
  'market/fetchListing',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market/listings/${listingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listing');
    }
  }
);

export const createNewBookListing = createAsyncThunk(
  'market/createNewBookListing',
  async (listingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_BASE_URL}/market/listings/new-book`, listingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create listing');
    }
  }
);

export const createOldBookOwnListing = createAsyncThunk(
  'market/createOldBookOwnListing',
  async (listingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_BASE_URL}/market/listings/old-book-own`, listingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create listing');
    }
  }
);

export const createOldBookOtherListing = createAsyncThunk(
  'market/createOldBookOtherListing',
  async (listingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_BASE_URL}/market/listings/old-book-other`, listingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create listing');
    }
  }
);

export const updateListingStatus = createAsyncThunk(
  'market/updateListingStatus',
  async ({ listingId, action }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.patch(`${API_BASE_URL}/market/listings/${listingId}/${action}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update listing');
    }
  }
);

export const deleteListing = createAsyncThunk(
  'market/deleteListing',
  async (listingId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(`${API_BASE_URL}/market/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return listingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete listing');
    }
  }
);

export const fetchBooks = createAsyncThunk(
  'market/fetchBooks',
  async (search = '', { rejectWithValue }) => {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await axios.get(`${API_BASE_URL}/market/books${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
    }
  }
);

// Admin actions
export const fetchPendingVerifications = createAsyncThunk(
  'market/fetchPendingVerifications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_BASE_URL}/admin/market/verification`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: auth.user?.id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending verifications');
    }
  }
);

export const approveListing = createAsyncThunk(
  'market/approveListing',
  async ({ listingId, adminNotes }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_BASE_URL}/admin/market/verification/${listingId}/approve`, 
        { adminNotes }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: auth.user?.id,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve listing');
    }
  }
);

export const rejectListing = createAsyncThunk(
  'market/rejectListing',
  async ({ listingId, reason, adminNotes }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_BASE_URL}/admin/market/verification/${listingId}/reject`, 
        { reason, adminNotes }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: auth.user?.id,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject listing');
    }
  }
);

const initialState = {
  listings: [],
  myListings: [],
  currentListing: null,
  books: [],
  pendingVerifications: [],
  loading: false,
  myListingsLoading: false,
  booksLoading: false,
  pendingVerificationsLoading: false,
  error: null,
  myListingsError: null,
  booksError: null,
  pendingVerificationsError: null,
  filters: {
    type: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  },
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.myListingsError = null;
      state.booksError = null;
      state.pendingVerificationsError = null;
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        location: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch listings
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.data;
        state.error = null;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my listings
      .addCase(fetchMyListings.pending, (state) => {
        state.myListingsLoading = true;
        state.myListingsError = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.myListingsLoading = false;
        state.myListings = action.payload.data;
        state.myListingsError = null;
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.myListingsLoading = false;
        state.myListingsError = action.payload;
      })
      // Fetch single listing
      .addCase(fetchListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListing.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload.data;
        state.error = null;
      })
      .addCase(fetchListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create listings
      .addCase(createNewBookListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewBookListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.unshift(action.payload.data);
        state.myListings.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createNewBookListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOldBookOwnListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOldBookOwnListing.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createOldBookOwnListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOldBookOtherListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOldBookOtherListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.unshift(action.payload.data);
        state.myListings.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createOldBookOtherListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update listing status
      .addCase(updateListingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateListingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedListing = action.payload.data;
        
        // Update in listings array
        const listingIndex = state.listings.findIndex(l => l._id === updatedListing._id);
        if (listingIndex !== -1) {
          state.listings[listingIndex] = updatedListing;
        }
        
        // Update in myListings array
        const myListingIndex = state.myListings.findIndex(l => l._id === updatedListing._id);
        if (myListingIndex !== -1) {
          state.myListings[myListingIndex] = updatedListing;
        }
        
        // Update current listing if it's the same
        if (state.currentListing && state.currentListing._id === updatedListing._id) {
          state.currentListing = updatedListing;
        }
        
        state.error = null;
      })
      .addCase(updateListingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete listing
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        
        // Remove from listings array
        state.listings = state.listings.filter(l => l._id !== deletedId);
        
        // Remove from myListings array
        state.myListings = state.myListings.filter(l => l._id !== deletedId);
        
        // Clear current listing if it's the deleted one
        if (state.currentListing && state.currentListing._id === deletedId) {
          state.currentListing = null;
        }
        
        state.error = null;
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.booksLoading = true;
        state.booksError = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.booksLoading = false;
        state.books = action.payload.data;
        state.booksError = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.booksLoading = false;
        state.booksError = action.payload;
      })
      // Admin actions
      .addCase(fetchPendingVerifications.pending, (state) => {
        state.pendingVerificationsLoading = true;
        state.pendingVerificationsError = null;
      })
      .addCase(fetchPendingVerifications.fulfilled, (state, action) => {
        state.pendingVerificationsLoading = false;
        state.pendingVerifications = action.payload.data;
        state.pendingVerificationsError = null;
      })
      .addCase(fetchPendingVerifications.rejected, (state, action) => {
        state.pendingVerificationsLoading = false;
        state.pendingVerificationsError = action.payload;
      })
      .addCase(approveListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveListing.fulfilled, (state, action) => {
        state.loading = false;
        const approvedListing = action.payload.data;
        
        // Remove from pending verifications
        state.pendingVerifications = state.pendingVerifications.filter(
          l => l._id !== approvedListing._id
        );
        
        // Update in myListings array
        const myListingIndex = state.myListings.findIndex(l => l._id === approvedListing._id);
        if (myListingIndex !== -1) {
          state.myListings[myListingIndex] = approvedListing;
        }
        
        // Add to listings array
        state.listings.unshift(approvedListing);
        
        state.error = null;
      })
      .addCase(approveListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectListing.fulfilled, (state, action) => {
        state.loading = false;
        const rejectedListing = action.payload.data.listing;
        
        // Remove from pending verifications
        state.pendingVerifications = state.pendingVerifications.filter(
          l => l._id !== rejectedListing._id
        );
        
        // Update in myListings array
        const myListingIndex = state.myListings.findIndex(l => l._id === rejectedListing._id);
        if (myListingIndex !== -1) {
          state.myListings[myListingIndex] = rejectedListing;
        }
        
        state.error = null;
      })
      .addCase(rejectListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentListing,
  setFilters,
  clearFilters,
} = marketSlice.actions;

export default marketSlice.reducer;
