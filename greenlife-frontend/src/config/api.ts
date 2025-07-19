// API configuration
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Debug logging (will be removed in production builds)
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("API BASE_URL:", baseUrl);

export const API_CONFIG = {
    BASE_URL: baseUrl,
    ENDPOINTS: {
        TREES: "/trees/",
        GEOJSON: "/trees/geojson/",
        LOGIN: "/login/",
        REGISTER: "/register/",
        MY_STATS: "/trees/my_stats/",
    },
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string) => {
    const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log("Building API URL:", fullUrl);
    return fullUrl;
};
