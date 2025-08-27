/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './store';
import './index.css';

// Initialize theme from localStorage or system preference
const ThemeInitializer = ({ children }) => {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored ? stored === 'dark' : prefersDark;
    const root = document.documentElement;
    if (shouldUseDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeInitializer>
          <App />
        </ThemeInitializer>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
