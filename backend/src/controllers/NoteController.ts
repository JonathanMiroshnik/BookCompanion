import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { CreateNoteData } from '../types/Note';

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  /**
   * Gets all notes for a specific book
   */
  async getNotesByBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;
      const notes = await this.noteService.getNotesByBook(id, userId);
    
      res.status(200).json({
        success: true,
        data: notes,
        total: notes.length,
        message: 'Notes retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get notes' });
    }
  }

  /**
   * Gets a specific note by ID
   */
  async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // var userId = (req as any).user.id; // From auth middleware
      
      // TODO: Implement get book by ID
      // - Validate book ownership
      // - Call BookService.getBookById(bookId, userId)
      // - Return book details

      const userId = '123';
      const note = await this.noteService.getNoteById(id, userId);
      console.log('note', note);
      
      res.status(200).json({
        success: true,
        data: note,
        message: 'Note retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get note' });
    }
  }

  /**
   * Creates a new note
   */
  async createNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId;
      const noteData: CreateNoteData = req.body.note;
      
      // TODO: Implement create note
      // - Validate note data (content, bookId, etc.)

      const note = await this.noteService.createNote(noteData, id, userId);
      console.log('Note created', note);  
      
      res.status(201).json({
        success: true,
        data: note,
        message: 'Note created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create note' });
    }
  }

  /**
   * Updates an existing note
   */
  async updateNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const updateData = req.body;
      
      // TODO: Implement update note
      // - Validate note ownership
      // - Call NoteService.updateNote(noteId, updateData, userId)
      // - Return updated note
      
      res.status(501).json({ message: 'Update note not implemented yet', noteId: id, updateData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update note' });
    }
  }

  /**
   * Deletes a note
   */
  async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // TODO: Implement delete note
      // - Validate note ownership
      // - Call NoteService.deleteNote(noteId, userId)
      // - Return success confirmation
      
      res.status(501).json({ message: 'Delete note not implemented yet', noteId: id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  }

  /**
   * Searches notes across all user's books
   */
  async searchNotes(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { query, bookId, tags, dateRange } = req.query;
      
      // TODO: Implement note search
      // - Parse search parameters
      // - Call NoteService.searchNotes(searchParams, userId)
      // - Return filtered and ranked results
      
      res.status(501).json({ message: 'Note search not implemented yet', query, bookId, tags, dateRange });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search notes' });
    }
  }

  /**
   * Gets all unique tags used in user's notes
   */
  async getNoteTags(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      // TODO: Implement get note tags
      // - Call NoteService.getNoteTags(userId)
      // - Return list of unique tags with usage counts
      
      res.status(501).json({ message: 'Get note tags not implemented yet' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get note tags' });
    }
  }
}
