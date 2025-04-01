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
};

// Determine which environment to use
const env = process.env.NODE_ENV || "development";

// Export the configuration for the current environment
export const config = environments[env]; 