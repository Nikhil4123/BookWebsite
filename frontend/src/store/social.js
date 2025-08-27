import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'social/fetchPosts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/posts/feed`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          id: auth.user?.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const searchPosts = createAsyncThunk(
  'social/searchPosts',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'social/createPost',
  async (postData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          id: auth.user?.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const reactToPost = createAsyncThunk(
  'social/reactToPost',
  async ({ postId, reactionType }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/react`, 
        { type: reactionType },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            id: auth.user?.id
          }
        }
      );
      return { postId, reaction: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to react to post');
    }
  }
);

const initialState = {
  posts: [],
  searchResults: [],
  currentPost: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    visibility: 'all'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  },
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchResults = [];
      state.pagination.currentPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data || [];
        state.pagination.totalPages = Math.ceil(
          (action.payload.data?.length || 0) / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search posts
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.data);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // React to post
      .addCase(reactToPost.fulfilled, (state, action) => {
        const { postId, reaction } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post) {
          // Update reaction count logic would go here
          // For now, just mark as reacted
        }
      });
  }
});

export const {
  setFilters,
  setCurrentPage,
  clearFilters,
  clearError,
  clearSearchResults,
  setCurrentPost,
} = socialSlice.actions;

export default socialSlice.reducer;
