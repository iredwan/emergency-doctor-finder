// Environment configuration
const environments = {
  development: {
    baseURL: "http://localhost:5000/api",
    uploadURL: "http://localhost:5000/upload-file/",
  },
  production: {
    // Update these URLs with your Satisfyhost domain when you get it
    baseURL: "https://doctor-finder.ifrahimredwan.info/api",
    uploadURL: "https://doctor-finder.ifrahimredwan.info/upload-file/",
  },
  // Config for when frontend is served directly from backend
  server: {
    baseURL: "/api",
    uploadURL: "/upload-file/",
  }
};

// Determine which environment to use
let env = process.env.NODE_ENV || "development";

// If we're running on the server (not a browser) or we're in production
if (typeof window !== 'undefined') {
  // Check if we're being served from the same origin as the API
  const currentOrigin = window.location.origin;
  if (currentOrigin.includes('localhost:5000') || 
      currentOrigin === 'https://doctor-finder.ifrahimredwan.info') {
    env = "server";
    console.log("Using server configuration for API calls");
  }
}

// Export the configuration for the current environment
export const config = environments[env]; 