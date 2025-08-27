require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongoURI: process.env.MONGODB_URI || process.env.URI || 'mongodb://localhost:27017/bookwebsite',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'bookstore123',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  
  // CORS configuration
  frontendURL: process.env.FRONTEND_URL || 'https://book-website-two.vercel.app',
  
  // Socket.IO configuration
  socketCors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'https://book-website-two.vercel.app'] 
      : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ["GET", "POST"],
    credentials: true
  }
};

module.exports = config;
