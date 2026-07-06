import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user without password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          statusCode: 401
        });
      }

      return next(); // Always return when calling next() to prevent double execution

    } catch (error) {
      console.error('Authentication error:', error.message);

      // Handle token expiration explicitly
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token has expired',
          statusCode: 401
        });
      }

      // FALLBACK FIX: Handles 'jwt malformed', 'jwt signature is invalid', etc.
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token invalid',
        statusCode: 401
      });
    }
  }

  // 2. If no token was provided at all
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
      statusCode: 401
    });
  }
};

export default protect;