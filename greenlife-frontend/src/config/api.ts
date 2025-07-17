// API configuration
export const API_CONFIG = {
  BASE_URL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api',
  ENDPOINTS: {
    TREES: '/trees/',
    GEOJSON: '/trees/geojson/',
    LOGIN: '/login/',
    REGISTER: '/register/',
    MY_STATS: '/trees/my_stats/',
  },
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
