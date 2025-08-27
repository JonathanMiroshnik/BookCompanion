import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { authMiddleware } from '../middleware/authMiddleware';

export function createAIRoutes(): Router {
  const router = Router();
  const aiController = new AIController();

  // Apply authentication middleware to all AI routes
  router.use(authMiddleware);

  // AI query routes
  router.post('/query', aiController.processQuery.bind(aiController));
  router.post('/chat', aiController.chat.bind(aiController));
  router.get('/context/:bookId', aiController.getBookContext.bind(aiController));
  
  // Embedding management
  // router.post('/books/:bookId/embed', aiController.embedBook.bind(aiController));
  router.get('/books/:bookId/embeddings', aiController.getBookEmbeddings.bind(aiController));

  return router;
}

export default createAIRoutes;