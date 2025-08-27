import { Request, Response } from 'express';
import { BookService } from '../services/BookService';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  /**
   * Gets all books for the authenticated user
   */
  async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string;
      const books = await this.bookService.getAllBooks(userId);
      
      res.status(200).json({
        success: true,
        data: books,
        total: books.length,
        message: 'Books retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get books' });
    }
  }

  /**
   * Gets a specific book by ID
   */
  async getBookById(req: Request, res: Response): Promise<void> {
    console.log('getBookById', req.params);
    try {
      const { id } = req.params;
      // var userId = (req as any).user.id; // From auth middleware

      // TODO: Implement get book by ID
      // - Validate book ownership
      // - Call BookService.getBookById(bookId, userId)
      // - Return book details

      const userId = '123';
      const book = await this.bookService.getBookById(id, userId);
      
      res.status(200).json({
        success: true,
        data: book,
        message: 'Book retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get book' });
    }
  }

  /**
   * Creates a new book
   */
  async createBook(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      const bookData = req.body.book;
      
      // TODO: Implement create book
      // - Validate book data (title, author, etc.)

      const book = await this.bookService.createBook(bookData, userId);
      console.log('Book created', book);  
      
      res.status(201).json({
        success: true,
        data: book,
        message: 'Book created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create book' });
    }
  }

  /**
   * Updates an existing book
   */
  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      const updateData = req.body.book;
      
      const book = await this.bookService.updateBook(id, updateData, userId);
      
      res.status(200).json({
        success: true,
        data: book,
        message: 'Book updated successfully'
      });
      
      // TODO: Implement update book
      // - Validate book ownership
      // - Call BookService.updateBook(bookId, updateData, userId)
      // - Return updated book
    } catch (error) {
      res.status(500).json({ error: 'Failed to update book' });
    }
  }

  /**
   * Deletes a book
   */
  async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // TODO: Implement delete book
      // - Validate book ownership
      // - Call BookService.deleteBook(bookId, userId)
      // - Clean up associated notes and embeddings
      
      res.status(501).json({ message: 'Delete book not implemented yet', bookId: id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete book' });
    }
  }

  /**
   * Ingests book content for AI processing
   * Chunks text and creates embeddings
   */
  async ingestBookContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const { content, fileType } = req.body;
      
      // TODO: Implement book content ingestion
      // - Validate book ownership
      // - Process content (PDF, text, etc.)
      // - Chunk text into segments
      // - Create embeddings via AIService
      // - Store in vector database
      
      res.status(501).json({ message: 'Book ingestion not implemented yet', bookId: id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to ingest book content' });
    }
  }

  /**
   * Gets the ingestion status for a book
   */
  async getIngestionStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // TODO: Implement ingestion status check
      // - Check if book has been processed
      // - Return status (pending, processing, completed, failed)
      // - Include progress information
      
      res.status(501).json({ message: 'Get ingestion status not implemented yet', bookId: id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get ingestion status' });
    }
  }
}
