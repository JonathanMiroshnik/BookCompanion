"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookRoutes = createBookRoutes;
const express_1 = require("express");
const BookController_1 = require("../controllers/BookController");
function createBookRoutes() {
    const router = (0, express_1.Router)();
    const bookController = new BookController_1.BookController();
    // // Apply authentication middleware to all book routes
    // router.use(authMiddleware);
    // CRUD operations for books
    router.get('/', bookController.getAllBooks.bind(bookController));
    router.get('/:id', bookController.getBookById.bind(bookController));
    // Using .bind(bookController) to preserve the 'this' context when the method is called
    // Without bind, 'this' inside createBook would be undefined or refer to the wrong object
    // The input 'bookController' becomes the new 'this' value for the createBook method
    router.post('/', bookController.createBook.bind(bookController));
    router.put('/:id', bookController.updateBook.bind(bookController));
    router.delete('/:id', bookController.deleteBook.bind(bookController));
    // Book content ingestion for AI processing
    router.post('/:id/ingest', bookController.ingestBookContent.bind(bookController));
    router.get('/:id/status', bookController.getIngestionStatus.bind(bookController));
    return router;
}
exports.default = createBookRoutes;
//# sourceMappingURL=bookRoutes.js.map