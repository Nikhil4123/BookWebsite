// Central API configuration
// Uses Vite env var if provided; falls back to deployed backend for production
export const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || 'https://bookwebsite-md9c.onrender.com/api/v1');


