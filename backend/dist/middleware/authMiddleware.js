"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
/**
 * Authentication middleware
 * Validates JWT token and adds user info to request
 */
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    });
}
/**
 * Optional authentication middleware
 * Adds user info if token is valid, but doesn't require it
 */
function optionalAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        catch (error) {
            // Continue without user on error
            next();
        }
    });
}
//# sourceMappingURL=authMiddleware.js.map