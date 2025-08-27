import { Note, CreateNoteData, UpdateNoteData } from '../types/Note';
import { getDatabase } from '../db/sqlite';

export class NoteService {
  private db = getDatabase();

  /**
   * Gets all notes for a specific book
   */
  async getNotesByBook(bookId: string, userId: string, page: number = 1, limit: number = 50): Promise<Note[]> {
    const offset = (page - 1) * limit;
    
    // Get paginated notes
    const query = `
      SELECT * FROM notes 
      WHERE book_id = ? AND user_id = ? 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const notes = await this.db.all(query, [bookId, userId, limit, offset]);
    if (!notes) {
      return [];
    }

    return notes.map(note => ({
      id: note.id,
      bookId: note.book_id,
      userId: note.user_id,
      title: note.title || undefined,
      content: note.content,
      pageReference: note.page_reference || undefined,
      tags: JSON.parse(note.tags || '[]'),
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    }));
  }

  /**
   * Gets a specific note by ID
   */
  async getNoteById(noteId: string, userId: string): Promise<Note> {
    const query = `
      SELECT * FROM notes 
      WHERE id = ? AND user_id = ?
    `;
    
    const note = await this.db.get(query, [noteId, userId]);
    if (!note) {
      throw new Error('Note not found');
    }

    return {
      ...note,
      tags: JSON.parse(note.tags || '[]'),
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    };
  }

  /**
   * Gets a specific note from a book (with book validation)
   */
  async getBookNote(bookId: string, noteId: string, userId: string): Promise<Note> {
    const query = `
      SELECT * FROM notes 
      WHERE id = ? AND book_id = ? AND user_id = ?
    `;
    
    const note = await this.db.get(query, [noteId, bookId, userId]);
    if (!note) {
      throw new Error('Note not found or does not belong to the specified book');
    }

    return {
      ...note,
      tags: JSON.parse(note.tags || '[]'),
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    };
  }

  /**
   * Creates a new note
   */
  async createNote(noteData: CreateNoteData, bookId: string, userId: string): Promise<Note> {
    const query = `
      INSERT INTO notes (
        id, book_id, user_id, title, content, page_reference, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tags = JSON.stringify(noteData.tags || []);

    try {
      await this.db.run(query, [
        noteId,
        bookId,
        userId,
        noteData.title || null,
        noteData.content,
        noteData.pageReference || null,
        tags
      ]);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }

    return this.getNoteById(noteId, userId);
  }

  /**
   * Updates an existing note
   */
  async updateNote(noteId: string, updateData: UpdateNoteData, userId: string): Promise<Note> {
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.content !== undefined) {
      fields.push('content = ?');
      values.push(updateData.content);
    }
    if (updateData.pageReference !== undefined) {
      fields.push('page_reference = ?');
      values.push(updateData.pageReference);
    }
    if (updateData.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updateData.tags));
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `
      UPDATE notes 
      SET ${fields.join(', ')} 
      WHERE id = ? AND user_id = ?
    `;
    
    values.push(noteId, userId);
    
    const result = await this.db.run(query, values);
    if (result.changes === 0) {
      throw new Error('Note not found or no changes made');
    }

    return this.getNoteById(noteId, userId);
  }

  /**
   * Updates a note from a specific book (with book validation)
   */
  async updateBookNote(bookId: string, noteId: string, updateData: UpdateNoteData, userId: string): Promise<Note> {
    // Validate that the note belongs to the specified book
    const noteQuery = `SELECT id FROM notes WHERE id = ? AND book_id = ? AND user_id = ?`;
    const note = await this.db.get(noteQuery, [noteId, bookId, userId]);
    if (!note) {
      throw new Error('Note not found or does not belong to the specified book');
    }

    return this.updateNote(noteId, updateData, userId);
  }

  /**
   * Deletes a note
   */
  async deleteNote(noteId: string, userId: string): Promise<void> {
    const result = await this.db.run('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
    if (result.changes === 0) {
      throw new Error('Note not found');
    }
  }

  /**
   * Deletes a note from a specific book (with book validation)
   */
  async deleteBookNote(bookId: string, noteId: string, userId: string): Promise<void> {
    // Validate that the note belongs to the specified book
    const noteQuery = `SELECT id FROM notes WHERE id = ? AND book_id = ? AND user_id = ?`;
    const note = await this.db.get(noteQuery, [noteId, bookId, userId]);
    if (!note) {
      throw new Error('Note not found or does not belong to the specified book');
    }

    await this.deleteNote(noteId, userId);
  }

  /**
   * Searches notes across all user's books
   */
  async searchNotes(searchParams: any, userId: string): Promise<Note[]> {
    const { query, tags, bookId, pageFrom, pageTo } = searchParams;
    
    let sqlQuery = `
      SELECT n.* FROM notes n
      JOIN books b ON n.book_id = b.id
      WHERE n.user_id = ?
    `;
    const values = [userId];
    
    if (query) {
      sqlQuery += ` AND (n.title LIKE ? OR n.content LIKE ?)`;
      values.push(`%${query}%`, `%${query}%`);
    }
    
    if (bookId) {
      sqlQuery += ` AND n.book_id = ?`;
      values.push(bookId);
    }
    
    if (pageFrom !== undefined) {
      sqlQuery += ` AND n.page_reference >= ?`;
      values.push(pageFrom);
    }
    
    if (pageTo !== undefined) {
      sqlQuery += ` AND n.page_reference <= ?`;
      values.push(pageTo);
    }
    
    sqlQuery += ` ORDER BY n.created_at DESC`;
    
    const notes = await this.db.all(sqlQuery, values);
    if (!notes) {
      return [];
    }
    
    return notes.map(note => ({
      ...note,
      tags: JSON.parse(note.tags || '[]'),
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    }));
  }

  /**
   * Gets all unique tags used in user's notes
   */
  async getNoteTags(userId: string): Promise<{ tag: string; count: number }[]> {
    const query = `
      SELECT 
        json_extract(tag.value, '$') as tag,
        COUNT(*) as count
      FROM notes n,
           json_each(n.tags) as tag
      WHERE n.user_id = ?
      GROUP BY tag
      ORDER BY count DESC
    `;
    
    const tags = await this.db.all(query, [userId]);
    return tags || [];
  }

  /**
   * Gets notes by tag
   */
  async getNotesByTag(tag: string, userId: string): Promise<Note[]> {
    const query = `
      SELECT * FROM notes 
      WHERE user_id = ? AND json_extract(tags, '$') LIKE ?
      ORDER BY created_at DESC
    `;
    
    const notes = await this.db.all(query, [userId, `%${tag}%`]);
    if (!notes) {
      return [];
    }
    
    return notes.map(note => ({
      ...note,
      tags: JSON.parse(note.tags || '[]'),
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    }));
  }

  /**
   * Adds tags to a note
   */
  async addTagsToNote(noteId: string, tags: string[], userId: string): Promise<void> {
    const note = await this.getNoteById(noteId, userId);
    const existingTags = note.tags || [];
    const newTags = [...new Set([...existingTags, ...tags])];
    
    await this.updateNote(noteId, { tags: newTags }, userId);
  }

  /**
   * Removes tags from a note
   */
  async removeTagsFromNote(noteId: string, tags: string[], userId: string): Promise<void> {
    const note = await this.getNoteById(noteId, userId);
    const existingTags = note.tags || [];
    const newTags = existingTags.filter(tag => !tags.includes(tag));
    
    await this.updateNote(noteId, { tags: newTags }, userId);
  }
}
