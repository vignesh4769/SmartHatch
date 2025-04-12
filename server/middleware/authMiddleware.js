import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Token blacklist store
const tokenBlacklist = new Set();

// Clean up expired tokens from blacklist periodically
setInterval(() => {
  const now = Date.now() / 1000; // Current time in seconds
  tokenBlacklist.forEach(token => {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp < now) {
        tokenBlacklist.delete(token);
      }
    } catch (error) {
      tokenBlacklist.delete(token); // Remove invalid tokens
    }
  });
}, 3600000); // Clean up every hour

// Middleware to protect routes - ensures user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header and validate format
      const authParts = req.headers.authorization.split(' ');
      if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
        throw new Error('Invalid Authorization header format');
      }
      token = authParts[1];

      // Validate token string
      if (!token || token.trim() === '') {
        throw new Error('Empty token provided');
      }

      // Check JWT configuration
      if (!process.env.JWT_KEY) {
        console.error('JWT_KEY environment variable is not set');
        throw new Error('Authentication service misconfigured');
      }

      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        throw new Error('Token has been invalidated - please login again');
      }

      // Verify token and handle expiration
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_KEY);

        // Additional security checks
        const now = Date.now() / 1000;
        if (decoded.iat > now) {
          throw new Error('Token issued in the future - invalid');
        }
        if (decoded.exp <= now) {
          throw new Error('Token has expired');
        }
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          throw new Error('Session expired - please login again');
        }
        throw new Error('Invalid token - please login again');
      }

      // Validate token payload
      if (!decoded._id || !decoded.role || !decoded.email) {
        throw new Error('Invalid token format - please login again');
      }

      // Get user from token and attach to request
      const user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        throw new Error('User not found or deactivated');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', {
        message: error.message,
        type: error.name,
        token: token ? '***' : 'none'
      });
      
      res.status(401);
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid or malformed token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired - please login again');
      } else {
        throw new Error(error.message || 'Authentication failed');
      }
    }
  } else {
    res.status(401);
    throw new Error('Authentication required - no token provided');
  }
});

// Middleware to check for admin role
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
});

// Middleware to check for employee role
const employee = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an employee');
  }
});

export { protect, admin, employee };