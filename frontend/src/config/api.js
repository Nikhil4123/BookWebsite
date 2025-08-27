// Central API configuration
// Uses Vite env var if provided; falls back to localhost:5000 for development
export const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:3101/api/v1');


