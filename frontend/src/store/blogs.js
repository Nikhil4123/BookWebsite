import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Async thunks
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const searchBlogs = createAsyncThunk(
  'blogs/searchBlogs',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search blogs');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_BASE_URL}/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          id: auth.user?.id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

const initialState = {
  blogs: [],
  searchResults: [],
  currentBlog: null,
  loading: false,
  error: null,
  filters: {
    tag: '',
    author: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12,
  },
};

const blogsSlice = createSlice({
  name: 'blogs',
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
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data || [];
        state.pagination.totalPages = Math.ceil(
          (action.payload.data?.length || 0) / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search blogs
      .addCase(searchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload.data);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setCurrentPage,
  clearFilters,
  clearError,
  clearSearchResults,
  setCurrentBlog,
} = blogsSlice.actions;

export default blogsSlice.reducer;
