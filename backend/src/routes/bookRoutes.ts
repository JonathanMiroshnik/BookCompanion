import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { authMiddleware } from '../middleware/authMiddleware';
import { NoteController } from '../controllers/NoteController';

export function createBookRoutes(): Router {
    const router = Router();
    const bookController = new BookController();
    const noteController = new NoteController();

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

    // CRUD operations for notes
    router.get('/:id/notes', noteController.getNotesByBook.bind(noteController));
    router.post('/:id/notes', noteController.createNote.bind(noteController));

    // Specific note operations
    router.get('/:bookId/notes/:noteId', noteController.getNoteById.bind(noteController));
    router.put('/:bookId/notes/:noteId', noteController.updateNote.bind(noteController));
    router.delete('/:bookId/notes/:noteId', noteController.deleteNote.bind(noteController));

    // Book content ingestion for AI processing
    router.post('/:id/ingest', bookController.ingestBookContent.bind(bookController));
    router.get('/:id/status', bookController.getIngestionStatus.bind(bookController));

    return router;
}

export default createBookRoutes;
