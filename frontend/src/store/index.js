/* eslint-disable no-unused-vars */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import booksReducer from './books';
import cartReducer from './cart';
import favoritesReducer from './favorites';
import uiReducer from './ui';
import blogsReducer from './blogs';
import socialReducer from './social';
import marketReducer from './market';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
    blogs: blogsReducer,
    social: socialReducer,
    market: marketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;