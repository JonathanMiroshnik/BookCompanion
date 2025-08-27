import { getDatabase } from '../db/sqlite';
import { Book, CreateBookData, UpdateBookData } from '../types/Book';

export class BookService {
  private db = getDatabase();

  async getAllBooks(userId: string): Promise<Book[]> {
    const query = `
      SELECT * FROM books 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    
    const books = await this.db.all(query, [userId]);
    if (!books) {
      throw new Error('No books found');
    }
    
    return books.map(book => ({
      ...book,
      tags: JSON.parse(book.tags || '[]'),
      createdAt: new Date(book.created_at),
      updatedAt: new Date(book.updated_at)
    }));
  }

  async createBook(bookData: CreateBookData, userId: string): Promise<Book> {
    const query = `
      INSERT INTO books (
        id, user_id, title, author, description, page_count, 
        genre, tags, reading_status, current_page, rating, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const bookId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tags = JSON.stringify(bookData.tags || []);

    try {
      await this.db.run(query, [
        bookId,
        userId,
        bookData.title,
        bookData.author || null,
        bookData.description || null,
        bookData.pageCount || null,
        bookData.genre || null,
        tags,
        bookData.readingStatus || 'not_started',
        bookData.currentPage || 0,
        bookData.rating || null,
        bookData.notes || null
      ]);
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }

    return this.getBookById(bookId, userId);
  }

  async getBookById(bookId: string, userId: string): Promise<Book> {
    console.log('getBookById', bookId, userId);
    const query = `
      SELECT * FROM books 
      WHERE id = ? AND user_id = ?
    `;
    
    const book = await this.db.get(query, [bookId, userId]);
    if (!book) {
      throw new Error('Book not found');
    }

    return {
      ...book,
      tags: JSON.parse(book.tags || '[]'),
      createdAt: new Date(book.created_at),
      updatedAt: new Date(book.updated_at)
    };
  }

  async updateBook(bookId: string, updateData: UpdateBookData, userId: string): Promise<Book> {
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.author !== undefined) {
      fields.push('author = ?');
      values.push(updateData.author);
    }
    if (updateData.isbn !== undefined) {
      fields.push('isbn = ?');
      values.push(updateData.isbn);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.pageCount !== undefined) {
      fields.push('page_count = ?');
      values.push(updateData.pageCount);
    }
    if (updateData.genre !== undefined) {
      fields.push('genre = ?');
      values.push(updateData.genre);
    }
    if (updateData.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updateData.tags));
    }
    if (updateData.readingStatus !== undefined) {
      fields.push('reading_status = ?');
      values.push(updateData.readingStatus);
    }
    if (updateData.currentPage !== undefined) {
      fields.push('current_page = ?');
      values.push(updateData.currentPage);
    }
    if (updateData.rating !== undefined) {
      fields.push('rating = ?');
      values.push(updateData.rating);
    }
    if (updateData.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updateData.notes);
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    console.log('fields', fields);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `
      UPDATE books 
      SET ${fields.join(', ')} 
      WHERE id = ? AND user_id = ?
    `;
    
    values.push(bookId, userId);
    
    const result = await this.db.run(query, values);
    if (result.changes === 0) {
      throw new Error('Book not found or no changes made');
    }

    return this.getBookById(bookId, userId);
  }

  async deleteBook(bookId: string, userId: string): Promise<void> {
    // Delete associated notes first (due to foreign key constraints)
    await this.db.run('DELETE FROM notes WHERE book_id = ? AND user_id = ?', [bookId, userId]);
    
    // Delete book embeddings
    await this.db.run('DELETE FROM book_embeddings WHERE book_id = ? AND user_id = ?', [bookId, userId]);
    
    // Delete embedding jobs
    await this.db.run('DELETE FROM embedding_jobs WHERE book_id = ? AND user_id = ?', [bookId, userId]);
    
    // Finally delete the book
    const result = await this.db.run('DELETE FROM books WHERE id = ? AND user_id = ?', [bookId, userId]);
    if (result.changes === 0) {
      throw new Error('Book not found');
    }
  }
}
