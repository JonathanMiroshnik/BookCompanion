"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAIRoutes = createAIRoutes;
const express_1 = require("express");
const AIController_1 = require("../controllers/AIController");
const authMiddleware_1 = require("../middleware/authMiddleware");
function createAIRoutes() {
    const router = (0, express_1.Router)();
    const aiController = new AIController_1.AIController();
    // Apply authentication middleware to all AI routes
    router.use(authMiddleware_1.authMiddleware);
    // AI query routes
    router.post('/query', aiController.processQuery.bind(aiController));
    router.post('/chat', aiController.chat.bind(aiController));
    router.get('/context/:bookId', aiController.getBookContext.bind(aiController));
    // Embedding management
    // router.post('/books/:bookId/embed', aiController.embedBook.bind(aiController));
    router.get('/books/:bookId/embeddings', aiController.getBookEmbeddings.bind(aiController));
    return router;
}
exports.default = createAIRoutes;
//# sourceMappingURL=aiRoutes.js.map