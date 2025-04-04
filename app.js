import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./src/routes/api.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import {
  DATABASE,
  MAX_JSON_SIZE,
  PORT,
  REQUEST_NUMBER,
  REQUEST_TIME,
  URL_ENCODE,
  WEB_CACHE,
} from "./src/config/config.js";

const app = express();

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Allow requests from both development and production
const allowedOrigins = [
  'https://doctor-finder.ifrahimredwan.info',
  'http://localhost:3000',
  'http://localhost:5000'
]; 

app.use(cookieParser());
app.use(cors({ 
  credentials: true, 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODE }));

// Configure helmet but keep it compatible with Next.js
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    xContentTypeOptions: false // Disable X-Content-Type-Options: nosniff temporarily
  })
);

const limiter = rateLimit({ windowMs: REQUEST_TIME, max: REQUEST_NUMBER });
app.use(limiter);

app.set("etag", WEB_CACHE);

mongoose
  .connect(DATABASE, { autoIndex: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// API routes
app.use("/api", router);

// Serve uploaded files
app.use("/upload-file", express.static("uploads", {
  setHeaders: (res, path, stat) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'client', 'public'), {
  maxAge: '30d',
  setHeaders: (res, path) => {
    const ext = path.substring(path.lastIndexOf('.'));
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    
    // Allow cross-origin resource sharing for images, etc.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Configure MIME types for Next.js files
const mimeTypes = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Serve Next.js static files with proper MIME types
app.use('/_next', express.static(join(__dirname, 'client', '.next'), {
  maxAge: '30d',
  setHeaders: (res, path) => {
    // Set the correct content type based on file extension
    const ext = path.substring(path.lastIndexOf('.'));
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    
    // Allow cross-origin resource sharing for fonts, etc.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  const faviconPath = join(__dirname, 'client', 'public', 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    res.setHeader('Content-Type', 'image/x-icon');
    res.sendFile(faviconPath);
  } else {
    res.status(204).end();
  }
});

// For all other requests, proxy to the Next.js dev server in development
// or serve the pre-rendered HTML in production
app.all('*', (req, res, next) => {
  // Skip API routes and upload-file routes which are handled by other middleware
  if (req.path.startsWith('/api') || req.path.startsWith('/upload-file')) {
    // Don't interfere with API routes or file uploads - let other middleware handle them
    return next();
  }
  
  // Handle Next.js RSC (React Server Component) requests
  if (req.url.includes('_rsc')) {
    console.log(`RSC request: ${req.url}`);
    // For RSC requests, we need to fix any potential URL discrepancies
    
    // Fix "services" vs "service" discrepancy (seems like client code uses "services" but route is "service")
    if (req.path.startsWith('/services')) {
      const correctedPath = req.path.replace('/services', '/service');
      const correctedUrl = req.url.replace('/services', '/service');
      console.log(`Correcting RSC path from ${req.path} to ${correctedPath}`);
      req.url = correctedUrl;
      req.path = correctedPath;
    }
  }
  
  // URL corrections for common issues
  const urlCorrections = {
    '/services': '/service',  // Fixing plural to singular for the service route
    '/images/': '/images/'    // Ensuring image paths work (redundant but explicit)
  };
  
  // Check if URL needs correction
  for (const [incorrect, correct] of Object.entries(urlCorrections)) {
    if (req.path.startsWith(incorrect)) {
      const correctedPath = req.path.replace(incorrect, correct);
      console.log(`Correcting path from ${req.path} to ${correctedPath}`);
      
      // Special handling for images - directly serve the file if it exists
      if (correct === '/images/' && req.path.startsWith('/images/')) {
        const imagePath = join(__dirname, 'client', 'public', req.path);
        if (fs.existsSync(imagePath)) {
          console.log(`Directly serving image from ${imagePath}`);
          return res.sendFile(imagePath);
        }
      }
      
      // For page routes, update path
      req.url = req.url.replace(incorrect, correct);
      req.path = correctedPath;
      break;
    }
  }
  
  // Handle legacy API endpoints that don't have the /api prefix
  const legacyApiEndpoints = [
    '/profile-login',
    '/profile-register',
    '/profile-logout',
    '/sent-otp',
    '/verify-otp',
    '/reset-password',
    '/forgot-password',
    '/file-upload',
    '/update-profile',
    '/single-profile'
  ];
  
  // Check if the current path matches any legacy API endpoint
  const isLegacyApiEndpoint = legacyApiEndpoints.some(endpoint => 
    req.path === endpoint || req.path.startsWith(`${endpoint}/`)
  );
  
  if (isLegacyApiEndpoint) {
    console.log(`Forwarding legacy API request from ${req.path} to /api${req.path}`);
    // Forward to the correct API endpoint
    req.url = `/api${req.url}`;
    return router(req, res, next);
  }
  
  try {
    // Check if this is a request for a static file that wasn't handled by express.static
    if (req.path.startsWith('/_next/')) {
      console.log(`Static file request: ${req.path}`);
      // Return 404 instead of redirecting to prevent redirect loops
      return res.status(404).send('Static file not found');
    }
    
    // For regular page requests, use pre-rendered HTML in production
    console.log(`Page request: ${req.path}`);
    
    // Check if we have an HTML file for this path in the .next/server/app directory
    let htmlPath;
    if (req.path === '/') {
      htmlPath = join(__dirname, 'client', '.next', 'server', 'app', 'index.html');
    } else {
      // Remove leading slash and replace additional slashes with subdirectories
      const pagePath = req.path.substring(1).replace(/\//g, '/');
      htmlPath = join(__dirname, 'client', '.next', 'server', 'app', `${pagePath}.html`);
    }
    
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
    
    // For non-existent pages, serve 404 page instead of redirecting
    const notFoundPath = join(__dirname, 'client', '.next', 'server', 'app', '_not-found.html');
    if (fs.existsSync(notFoundPath)) {
      return res.status(404).sendFile(notFoundPath);
    }
    
    // Last resort fallback
    return res.status(404).send('Page not found');
  } catch (error) {
    console.error('Error serving Next.js content:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

