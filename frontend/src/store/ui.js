import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Modal states
  showLoginModal: false,
  showSignupModal: false,
  showCartModal: false,
  showBookDetailsModal: false,
  
  // Sidebar states
  showSidebar: false,
  showFilters: false,
  
  // Theme and preferences
  theme: 'light',
  sidebarCollapsed: false,
  
  // Notifications
  notifications: [],
  
  // Loading states
  globalLoading: false,
  
  // Search
  searchQuery: '',
  searchSuggestions: [],
  
  // Responsive
  isMobile: false,
  isTablet: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    setShowLoginModal: (state, action) => {
      state.showLoginModal = action.payload;
    },
    setShowSignupModal: (state, action) => {
      state.showSignupModal = action.payload;
    },
    setShowCartModal: (state, action) => {
      state.showCartModal = action.payload;
    },
    setShowBookDetailsModal: (state, action) => {
      state.showBookDetailsModal = action.payload;
    },
    
    // Sidebar actions
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setShowFilters: (state, action) => {
      state.showFilters = action.payload;
    },
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Save to localStorage
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchSuggestions: (state, action) => {
      state.searchSuggestions = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchSuggestions = [];
    },
    
    // Responsive actions
    setResponsiveState: (state, action) => {
      const { isMobile, isTablet } = action.payload;
      state.isMobile = isMobile;
      state.isTablet = isTablet;
    },
    
    // Reset all UI state
    resetUI: () => initialState,
  },
});

export const {
  setShowLoginModal,
  setShowSignupModal,
  setShowCartModal,
  setShowBookDetailsModal,
  setShowSidebar,
  setShowFilters,
  toggleSidebar,
  toggleFilters,
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setSearchQuery,
  setSearchSuggestions,
  clearSearch,
  setResponsiveState,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
