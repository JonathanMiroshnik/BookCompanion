import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Validates JWT token and adds user info to request
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No valid authorization token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // TODO: Implement token validation
    // - Validate JWT token
    // - Extract user information
    // - Add user to request object
    
    // For now, return placeholder response
    res.status(501).json({ message: 'Authentication middleware not implemented yet' });
    
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional authentication middleware
 * Adds user info if token is valid, but doesn't require it
 */
export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    // TODO: Implement optional token validation
    // - Try to validate token
    // - Add user to request if valid
    // - Continue regardless of validation result
    
    next();
  } catch (error) {
    // Continue without user on error
    next();
  }
}
