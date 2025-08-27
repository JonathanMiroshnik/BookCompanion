import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(): Router {
  const router = Router();
  const authController = new AuthController();

  // Google OAuth flow endpoints
  router.get('/google', authController.initiateGoogleAuth.bind(authController));
  router.get('/google/callback', authController.handleGoogleCallback.bind(authController));
  router.get('/logout', authController.logout.bind(authController));
  
  // Session management
  router.get('/me', authController.getCurrentUser.bind(authController));
  router.post('/refresh', authController.refreshToken.bind(authController));

  return router;
}

export default createAuthRoutes;