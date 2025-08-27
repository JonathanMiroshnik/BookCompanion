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
exports.BookController = void 0;
const BookService_1 = require("../services/BookService");
class BookController {
    constructor() {
        this.bookService = new BookService_1.BookService();
    }
    /**
     * Gets all books for the authenticated user
     */
    getAllBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const books = yield this.bookService.getAllBooks(userId);
                res.status(200).json({
                    success: true,
                    data: books,
                    total: books.length,
                    message: 'Books retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get books' });
            }
        });
    }
    /**
     * Gets a specific book by ID
     */
    getBookById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getBookById', req.params);
            try {
                const { id } = req.params;
                // var userId = (req as any).user.id; // From auth middleware
                // TODO: Implement get book by ID
                // - Validate book ownership
                // - Call BookService.getBookById(bookId, userId)
                // - Return book details
                const userId = '123';
                const book = yield this.bookService.getBookById(id, userId);
                res.status(200).json({
                    success: true,
                    data: book,
                    message: 'Book retrieved successfully'
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get book' });
            }
        });
    }
    /**
     * Creates a new book
     */
    createBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                const bookData = req.body.book;
                // TODO: Implement create book
                // - Validate book data (title, author, etc.)
                const book = yield this.bookService.createBook(bookData, userId);
                console.log('Book created', book);
                res.status(201).json({
                    success: true,
                    data: book,
                    message: 'Book created successfully'
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create book' });
            }
        });
    }
    /**
     * Updates an existing book
     */
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.body.userId;
                const updateData = req.body.book;
                const book = yield this.bookService.updateBook(id, updateData, userId);
                res.status(200).json({
                    success: true,
                    data: book,
                    message: 'Book updated successfully'
                });
                // TODO: Implement update book
                // - Validate book ownership
                // - Call BookService.updateBook(bookId, updateData, userId)
                // - Return updated book
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update book' });
            }
        });
    }
    /**
     * Deletes a book
     */
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // TODO: Implement delete book
                // - Validate book ownership
                // - Call BookService.deleteBook(bookId, userId)
                // - Clean up associated notes and embeddings
                res.status(501).json({ message: 'Delete book not implemented yet', bookId: id });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete book' });
            }
        });
    }
    /**
     * Ingests book content for AI processing
     * Chunks text and creates embeddings
     */
    ingestBookContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const { content, fileType } = req.body;
                // TODO: Implement book content ingestion
                // - Validate book ownership
                // - Process content (PDF, text, etc.)
                // - Chunk text into segments
                // - Create embeddings via AIService
                // - Store in vector database
                res.status(501).json({ message: 'Book ingestion not implemented yet', bookId: id });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to ingest book content' });
            }
        });
    }
    /**
     * Gets the ingestion status for a book
     */
    getIngestionStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                // TODO: Implement ingestion status check
                // - Check if book has been processed
                // - Return status (pending, processing, completed, failed)
                // - Include progress information
                res.status(501).json({ message: 'Get ingestion status not implemented yet', bookId: id });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get ingestion status' });
            }
        });
    }
}
exports.BookController = BookController;
//# sourceMappingURL=BookController.js.map