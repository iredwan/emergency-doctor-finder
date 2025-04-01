/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Creates a standalone build that's easier to deploy
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression
  images: {
    // Define allowed image domains for Image component
    domains: ['localhost', 'your-domain.com'], // Replace with your actual domain
    unoptimized: true, // For static exports
  },
  // Add any environment variables needed in the browser
  env: {
    APP_ENV: process.env.NODE_ENV || 'development',
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://doctor-finder.ifrahimredwan.info' 
      : 'http://localhost:5000/api',
  },
};

export default nextConfig;
