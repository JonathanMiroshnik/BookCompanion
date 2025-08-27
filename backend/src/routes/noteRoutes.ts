import { Router } from 'express';
import { NoteController } from '../controllers/NoteController';
import { authMiddleware } from '../middleware/authMiddleware';

export function createNoteRoutes(): Router {
  const router = Router();
  const noteController = new NoteController();

  // Apply authentication middleware to all note routes
  router.use(authMiddleware);

  // Note CRUD routes
  router.get('/book/:bookId', noteController.getNotesByBook.bind(noteController));
  router.post('/book/:bookId', noteController.createNote.bind(noteController));
  router.get('/:id', noteController.getNoteById.bind(noteController));
  router.put('/:id', noteController.updateNote.bind(noteController));
  router.delete('/:id', noteController.deleteNote.bind(noteController));
  
  // Search and tags
  router.get('/search', noteController.searchNotes.bind(noteController));
  router.get('/tags', noteController.getNoteTags.bind(noteController));

  return router;
}

export default createNoteRoutes;