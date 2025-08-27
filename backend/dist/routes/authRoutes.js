"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
function createAuthRoutes() {
    const router = (0, express_1.Router)();
    const authController = new AuthController_1.AuthController();
    // Google OAuth flow endpoints
    router.get('/google', authController.initiateGoogleAuth.bind(authController));
    router.get('/google/callback', authController.handleGoogleCallback.bind(authController));
    router.get('/logout', authController.logout.bind(authController));
    // Session management
    router.get('/me', authController.getCurrentUser.bind(authController));
    router.post('/refresh', authController.refreshToken.bind(authController));
    return router;
}
exports.default = createAuthRoutes;
//# sourceMappingURL=authRoutes.js.map