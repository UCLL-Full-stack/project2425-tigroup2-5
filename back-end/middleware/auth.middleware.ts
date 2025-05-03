import { Request, Response, NextFunction } from 'express';
import authService from '../service/auth.service';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to check if the user is authenticated
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = authService.verifyToken(token);
    
    // Ensure decoded has the expected structure
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      console.error('Invalid token format:', decoded);
      return res.status(401).json({ message: 'Invalid token format.' });
    }
    
    // Add user info to request object
    req.user = decoded;
    
    // Add debug logging
    console.log(`Authenticated user: ${JSON.stringify({
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    })}`);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  next();
};

// Middleware to check if the user is an employee or admin
export const isEmployee = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  if (req.user.role !== 'employee' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Employee privileges required.' });
  }
  
  next();
};

// Middleware to check if user is accessing their own resource or is an admin
export const isOwnerOrAdmin = (paramIdField: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // User can access their own resources
    const resourceId = parseInt(req.params[paramIdField]);
    if (req.user.id === resourceId) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
  };
};